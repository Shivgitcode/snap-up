"use server";

import { db } from "@/drizzle/db";
import { globalUrls, monitorHistory, userMonitors } from "@/drizzle/schema";
import axios, { AxiosError } from "axios";
import { and, eq, gt, isNull, or, sql } from "drizzle-orm";
import { sendNotification } from "./sendemail";
import { createProducer } from "@/kafkaconfig/producer";

interface WebsiteToCheck {
  id: string;
  url: string | null;
}

interface WebsiteCheckResult {
  success: boolean;
  statusCode: number;
  errorMessage?: string;
  responseTime: number;
  url: string;
  isReachable: boolean;
}

export async function checkWebsiteStatus(
  website: WebsiteToCheck
): Promise<WebsiteCheckResult> {
  const startTime = Date.now();

  async function updateDatabase(
    statusCode: number,
    responseTime: number
  ): Promise<void> {
    try {
      await db.transaction(async (tx) => {
        await tx
          .update(globalUrls)
          .set({
            lastStatusCode: statusCode,
            lastCheckTime: sql`now()`,
          })
          .where(eq(globalUrls.id, website.id as string));

        await tx.insert(monitorHistory).values({
          urlId: website.id,
          statusCode,
          responseTime,
        });
      });
    } catch (dbError) {
      console.error("Database update failed:", dbError);
      throw dbError;
    }
  }

  // Validate URL format before making request
  try {
    new URL(website.url as string);
  } catch (urlError) {
    const responseTime = Date.now() - startTime;
    const errorMessage = "Invalid URL format";

    await sendNotification(errorMessage, responseTime, website.url as string);
    await updateDatabase(0, responseTime);

    return {
      success: false,
      statusCode: 0,
      errorMessage,
      responseTime,
      url: website.url as string,
      isReachable: false,
    };
  }

  try {
    // Website status check with DNS lookup timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await axios.get(website.url as string, {
      timeout: 10000,
      validateStatus: (status) => true,
      signal: controller.signal,
      headers: {
        "User-Agent": `Mozilla/5.0 (compatible; WebsiteMonitor/1.0; +${website.url})`,
      },
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;

    // Send notification if status is not 200
    if (response.status !== 200) {
      await sendNotification(
        response.statusText,
        responseTime,
        website.url as string
      );
    }

    await updateDatabase(response.status, responseTime);
    await createProducer({ statuscode: response.status, responseTime });

    return {
      success: true,
      statusCode: response.status,
      responseTime,
      url: website.url as string,
      isReachable: true,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    let errorMessage = "Unknown error occurred";
    let statusCode = 0; // Use 0 for non-HTTP errors
    let isReachable = false;

    if (error instanceof AxiosError) {
      switch (error.code) {
        case "ECONNREFUSED":
          errorMessage =
            "Connection refused - Server is not accepting connections";
          break;
        case "ETIMEDOUT":
          errorMessage = "Request timed out - Server took too long to respond";
          break;
        case "ENOTFOUND":
          errorMessage = "DNS lookup failed - Domain not found";
          break;
        case "ENETUNREACH":
          errorMessage = "Network unreachable";
          break;
        case "ECONNRESET":
          errorMessage = "Connection reset by peer";
          break;
        case "ECONNABORTED":
          errorMessage = "Connection aborted";
          break;
        case "CERT_HAS_EXPIRED":
          errorMessage = "SSL certificate has expired";
          statusCode = 526; // Invalid SSL certificate
          break;
        default:
          if (error.response) {
            statusCode = error.response.status;
            errorMessage = `HTTP ${statusCode}: ${error.response.statusText}`;
            isReachable = true; // Server responded, even though with an error
          } else if (error.request) {
            errorMessage = "No response received from server";
          }
      }
    }

    // Log the error with detailed information
    console.error(`Error monitoring ${website.url}:`, {
      error: errorMessage,
      originalError: error,
      timestamp: new Date().toISOString(),
      websiteId: website.id,
      errorCode: error instanceof AxiosError ? error.code : undefined,
      statusCode,
      isReachable,
    });

    try {
      await sendNotification(errorMessage, responseTime, website.url as string);
      await updateDatabase(statusCode, responseTime);
    } catch (secondaryError) {
      console.error("Failed to process error handling:", secondaryError);
    }

    return {
      success: false,
      statusCode,
      errorMessage,
      responseTime,
      url: website.url as string,
      isReachable,
    };
  }
}

export async function checkWebsitesToMonitor() {
  console.log("function triggered");
  try {
    // Get websites to check directly from the database instead of making an HTTP call
    const websitesToCheck = await db
      .select({
        id: globalUrls.id,
        url: globalUrls.url,
      })
      .from(globalUrls)
      .innerJoin(userMonitors, eq(globalUrls.id, userMonitors.urlId))
      .where(
        and(
          // Only include URLs with active monitors
          gt(globalUrls.activeMonitorCount, 0),

          // Ensure the monitor is active and not paused
          eq(userMonitors.isActive, true),
          eq(userMonitors.isPaused, false),

          // Check if the interval has been crossed
          or(
            isNull(globalUrls.lastCheckTime), // If never checked before
            sql`now() - ${globalUrls.lastCheckTime} > ${userMonitors.interval} * interval '1 minute'` // If interval has passed
          )
        )
      )
      .groupBy(globalUrls.id, globalUrls.url);

    console.log("in websites to check", websitesToCheck);

    if (!websitesToCheck.length) {
      return {
        message: "No websites need checking at this time",
        data: [],
      };
    }

    const results = await Promise.all(
      websitesToCheck.map((website) => checkWebsiteStatus(website))
    );

    return {
      message: "Websites checked successfully",
      data: results,
    };
  } catch (error) {
    console.error("Failed to check websites:", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}
