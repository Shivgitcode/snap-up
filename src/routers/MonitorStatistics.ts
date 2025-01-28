import { t } from "@/server/server";
import { z } from "zod";
import { monitorHistory } from "@/drizzle/schema";
import { gte, and, eq, sql } from "drizzle-orm";
import { db } from "@/drizzle/db";
export const StatisticsProcedure = t.router({
  getStats: t.procedure
    .input(
      z.object({
        urlId: z.string(),
        timeRange: z
          .enum(["24h", "7d", "30d", "all"])
          .default("all")
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      let startDate = new Date(0); // Default to beginning of time for 'all'

      // Set the time range
      switch (input.timeRange) {
        case "24h":
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }

      const history = await db
        .select()
        .from(monitorHistory)
        .where(
          and(
            eq(monitorHistory.urlId, input.urlId),
            gte(monitorHistory.checkedAt, startDate)
          )
        )
        .orderBy(monitorHistory.checkedAt);

      if (history.length === 0) {
        return {
          uptimePercentage: 0,
          totalChecks: 0,
          successfulChecks: 0,
          failedChecks: 0,
          averageResponseTime: 0,
          totalUptime: 0,
          totalDowntime: 0,
        };
      }

      let totalUptime = 0;
      let totalDowntime = 0;
      let successfulChecks = 0;
      let failedChecks = 0;
      let totalResponseTime = 0;

      // Calculate time differences between consecutive checks
      for (let i = 0; i < history.length - 1; i++) {
        const currentCheck = history[i];
        const nextCheck = history[i + 1];
        const timeDiff =
          ((nextCheck.checkedAt as Date).getTime() -
            (currentCheck.checkedAt as Date).getTime()) /
          1000; // in seconds

        if (currentCheck.statusCode && currentCheck.statusCode < 400) {
          totalUptime += timeDiff;
          successfulChecks++;
        } else {
          totalDowntime += timeDiff;
          failedChecks++;
        }

        if (currentCheck.responseTime) {
          totalResponseTime += currentCheck.responseTime;
        }
      }

      // Handle the last check up to current time
      const lastCheck = history[history.length - 1];
      const timeSinceLastCheck =
        (now.getTime() - (lastCheck.checkedAt as Date).getTime()) / 1000;

      if (lastCheck.statusCode && lastCheck.statusCode < 400) {
        totalUptime += timeSinceLastCheck;
        successfulChecks++;
      } else {
        totalDowntime += timeSinceLastCheck;
        failedChecks++;
      }

      const totalTimeMonitored = totalUptime + totalDowntime;
      const uptimePercentage =
        totalTimeMonitored > 0 ? (totalUptime / totalTimeMonitored) * 100 : 0;

      return {
        uptimePercentage: Number(uptimePercentage.toFixed(2)),
        totalChecks: history.length,
        successfulChecks,
        failedChecks,
        averageResponseTime: Math.round(totalResponseTime / history.length),
        totalUptime: Math.round(totalUptime),
        totalDowntime: Math.round(totalDowntime),
      };
    }),
  getHourlyStats: t.procedure
    .input(
      z.object({
        urlId: z.string(),
        hours: z.number().min(1).max(168).default(24), // Max 7 days
      })
    )
    .query(async ({ input }) => {
      const startDate = new Date();
      startDate.setHours(startDate.getHours() - input.hours);

      const hourlyStats = await db
        .select({
          hour: sql<number>`EXTRACT(HOUR FROM ${monitorHistory.checkedAt})::integer`,
          responseTime: sql<number>`ROUND(AVG(${monitorHistory.responseTime}))`,
          successRate: sql<number>`
          ROUND(
            (COUNT(CASE WHEN ${monitorHistory.statusCode} < 400 THEN 1 END)::decimal / 
            COUNT(*)::decimal) * 100
          )
        `,
          checkCount: sql<number>`COUNT(*)`,
        })
        .from(monitorHistory)
        .where(
          and(
            eq(monitorHistory.urlId, input.urlId),
            gte(monitorHistory.checkedAt, startDate)
          )
        )
        .groupBy(sql`EXTRACT(HOUR FROM ${monitorHistory.checkedAt})`)
        .orderBy(sql`EXTRACT(HOUR FROM ${monitorHistory.checkedAt})`);

      // Fill in missing hours with null values
      const currentHour = startDate.getHours();
      const fullHourlyStats = Array.from({ length: input.hours }, (_, i) => {
        const hour = (currentHour + i) % 24;
        const existingStats = hourlyStats.find((stat) => stat.hour === hour);

        return {
          hour,
          responseTime: existingStats?.responseTime ?? 0,
          successRate: existingStats?.successRate ?? 0,
          checkCount: existingStats?.checkCount ?? 0,
        };
      });

      return fullHourlyStats;
    }),
});
