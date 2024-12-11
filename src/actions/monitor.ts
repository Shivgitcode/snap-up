"use server";

import { db } from "@/drizzle/db";
import { Monitor, monitors } from "@/drizzle/schema";
import axios, { AxiosError } from "axios";
import { eq, sql } from "drizzle-orm";

async function checkWebsiteStatus(website: { id: string; url: string }) {
  try {
    const response = await axios.get(website.url, {
      timeout: 5000, // 5 second timeout
      validateStatus: (status) => true, // Don't throw on any status code
    });

    await db
      .update(monitors)
      .set({
        status: response.status === 200 ? "success" : "failed",
        statuscode: response.status,
        latestCheck: sql`now()`,
      })
      .where(eq(monitors.id, website.id))
      .returning({
        status: monitors.status,
      });
  } catch (error) {
    let errorMessage = "Unknown error occurred";
    let statusCode = 500;

    if (error instanceof AxiosError) {
      if (error.code === "ECONNREFUSED") {
        errorMessage = "Connection refused - website might be down";
      } else if (error.code === "ETIMEDOUT") {
        errorMessage = "Request timed out";
      } else if (error.response) {
        statusCode = error.response.status;
        errorMessage = `HTTP ${statusCode}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "No response received from server";
      }
    }

    // Log the error details
    console.error(`Error monitoring ${website.url}:`, {
      error: errorMessage,
      originalError: error,
    });

    // Update database with error information
    await db
      .update(monitors)
      .set({
        status: "failed",
        statuscode: statusCode,
        latestCheck: sql`now()`,
      })
      .where(eq(monitors.id, website.id))
      .returning({
        status: monitors.status,
      });
  }
}

async function checkWebsitesToMonitor() {
  try {
    const allData = await axios.get(
      "http://localhost:3000/api/trpc/getMonitorWebsiteToCheck",
      {
        timeout: 5000,
      }
    );

    const allMonitors: { id: string; url: string }[] =
      allData.data?.result?.data?.data;

    if (!allMonitors || !Array.isArray(allMonitors)) {
      throw new Error("Invalid data format received from API");
    }

    // Use Promise.all to handle all checks concurrently
    await Promise.all(
      allMonitors.map((monitor) => checkWebsiteStatus(monitor))
    );
  } catch (error) {
    console.error("Failed to check websites:", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    // You might want to add additional error handling here:
    // - Send notification to admin
    // - Log to error tracking service
    // - Retry after some delay
    throw error; // Re-throw if you want calling code to handle it
  }
}

export { checkWebsiteStatus, checkWebsitesToMonitor };
