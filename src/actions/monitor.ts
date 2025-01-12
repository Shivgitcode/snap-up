"use server";

import { db } from "@/drizzle/db";
import { globalUrls, monitorHistory, userMonitors } from "@/drizzle/schema";
import axios, { AxiosError } from "axios";
import { and, eq, gt, isNull, or, sql } from "drizzle-orm";
import { env } from "../../env";

interface WebsiteToCheck {
  id: string; // globalUrls.id
  url: string | null;
  urlId: string;
}

export async function checkWebsiteStatus(website: WebsiteToCheck) {
  console.log("function triggered");
  const startTime = Date.now();
  console.log(website.urlId);

  try {
    const response = await axios.get(website.url as string, {
      timeout: 5000,
      validateStatus: (status) => true,
    });

    const responseTime = Date.now() - startTime;

    await db.transaction(async (tx) => {
      // Update global URL status
      await tx
        .update(globalUrls)
        .set({
          lastStatusCode: response.status,
          lastCheckTime: sql`now()`,
        })
        .where(eq(globalUrls.id, website.urlId));

      // Create history record
      await tx.insert(monitorHistory).values({
        urlId: website.urlId,
        statusCode: response.status,
        responseTime: responseTime,
      });
    });

    return {
      success: true,
      statusCode: response.status,
      responseTime,
      url: website.url,
    };
  } catch (error) {
    let errorMessage = "Unknown error occurred";
    let statusCode = 500;
    const responseTime = Date.now() - startTime;

    if (error instanceof AxiosError) {
      if (error.code === "ECONNREFUSED") {
        errorMessage = "Connection refused";
      } else if (error.code === "ETIMEDOUT") {
        errorMessage = "Request timed out";
      } else if (error.response) {
        statusCode = error.response.status;
        errorMessage = `HTTP ${statusCode}`;
      } else if (error.request) {
        errorMessage = "No response received";
      }
    }

    console.error(`Error monitoring ${website.url}:`, {
      error: errorMessage,
      originalError: error,
    });

    await db.transaction(async (tx) => {
      await tx
        .update(globalUrls)
        .set({
          lastStatusCode: statusCode,
          lastCheckTime: sql`now()`,
        })
        .where(eq(globalUrls.id, website.id));

      await tx.insert(monitorHistory).values({
        urlId: website.id,
        statusCode: statusCode,
        responseTime: responseTime,
      });
    });

    return {
      success: false,
      statusCode,
      errorMessage,
      responseTime,
      url: website.url,
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
          gt(globalUrls.activeMonitorCount, 0),
          or(
            isNull(globalUrls.lastCheckTime),
            sql`EXISTS (
              SELECT 1 FROM ${userMonitors}
              WHERE ${userMonitors.urlId} = ${globalUrls.id}
              AND ${userMonitors.isActive} = true
              AND ${userMonitors.isPaused} = false
              AND now() - ${globalUrls.lastCheckTime} > ${userMonitors.interval} * interval '1 minute'
            )`
          )
        )
      )
      .groupBy(globalUrls.id, globalUrls.url);

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
