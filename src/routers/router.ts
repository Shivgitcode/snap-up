import { db } from "@/drizzle/db";
import {
  globalUrls,
  userMonitors,
  users,
  monitorHistory,
} from "@/drizzle/schema";
import { auth } from "@/server/auth";
import { t } from "@/server/server";
import { eq, gt, isNull, or, sql, and, exists, not, desc } from "drizzle-orm";
import { z } from "zod";
import { checkWebsitesToMonitor } from "@/actions/monitor";

export const monitorProcedure = t.router({
  // Create a new monitor
  createMonitor: t.procedure
    .input(
      z.object({ url: z.string(), name: z.string(), interval: z.number() })
    )
    .mutation(async ({ input }) => {
      const { url, name, interval } = input;

      // Get current user
      const curruser = await auth();
      const findUser = await db
        .select()
        .from(users)
        .where(eq(users.email, curruser?.user?.email as string));

      if (!findUser[0]) {
        throw new Error("User not found");
      }

      // Begin transaction
      return await db.transaction(async (tx) => {
        // Check if URL exists in global table
        let globalUrl = await tx
          .select()
          .from(globalUrls)
          .where(eq(globalUrls.url, url));

        // If URL doesn't exist globally, create it
        if (!globalUrl[0]) {
          globalUrl = await tx
            .insert(globalUrls)
            .values({
              url,
              activeMonitorCount: 1,
            })
            .returning();
        } else {
          // Increment active monitor count
          await tx
            .update(globalUrls)
            .set({
              activeMonitorCount: sql`${globalUrls.activeMonitorCount} + 1`,
            })
            .where(eq(globalUrls.id, globalUrl[0].id));
        }

        // Create user-specific monitor

        const userMonitor = await tx
          .insert(userMonitors)
          .values({
            urlId: globalUrl[0].id,
            userId: findUser[0].id,
            name,
            interval: interval,
            isActive: true,
            isPaused: false,
          })
          .returning();

        return {
          message: "Monitor created",
          data: {
            id: userMonitor[0].id,
            name: userMonitor[0].name,
            urlId: userMonitor[0].urlId,
            url,
          },
        };
      });
    }),

  // Get all monitors for current user
  getAllWebsites: t.procedure.query(async () => {
    const session = await auth();
    console.log("this is user session", session);
    const findUser = await db
      .select()
      .from(users)
      .where(eq(users.email, session?.user?.email as string));

    if (!findUser[0]) {
      throw new Error("User not found");
    }

    // Get user monitors with latest history
    const userMonitorsWithUrls = await db
      .select({
        id: userMonitors.id,
        name: userMonitors.name,
        url: globalUrls.url,
        urlId: userMonitors.urlId,
        userId: userMonitors.userId,
        interval: userMonitors.interval,
        isActive: userMonitors.isActive,
        isPaused: userMonitors.isPaused,
        statuscode: sql`(${db
          .select({ value: monitorHistory.statusCode })
          .from(monitorHistory)
          .where(eq(monitorHistory.urlId, globalUrls.id))
          .orderBy(desc(monitorHistory.checkedAt))
          .limit(1)})`.as("latest_status_code"),
        lastCheck: sql`(${db
          .select({ value: monitorHistory.checkedAt })
          .from(monitorHistory)
          .where(eq(monitorHistory.urlId, globalUrls.id))
          .orderBy(desc(monitorHistory.checkedAt))
          .limit(1)})`.as("latest_check_time"),
      })
      .from(userMonitors)
      .innerJoin(globalUrls, eq(userMonitors.urlId, globalUrls.id))
      .where(
        and(
          eq(userMonitors.userId, findUser[0].id),
          eq(userMonitors.isActive, true)
        )
      );

    return {
      message: "These are your monitors",
      monitors: userMonitorsWithUrls,
    };
  }),

  // Update monitor status
  updateMonitorStatus: t.procedure.query(async () => {
    try {
      const result = await checkWebsitesToMonitor();
      return {
        message: "Monitors updated successfully",
        data: result,
      };
    } catch (error) {
      console.error("Error updating monitors inside update status:", error);
      throw new Error("Failed to update monitors");
    }
  }),
  pauseMonitorStatus: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const [findUrl] = await db
          .select()
          .from(userMonitors)
          .where(eq(userMonitors.id, input.id));
        if (findUrl.isPaused) {
          await db
            .update(userMonitors)
            .set({ isPaused: false })
            .where(eq(userMonitors.id, input.id));
        } else {
          await db
            .update(userMonitors)
            .set({ isPaused: true })
            .where(eq(userMonitors.id, input.id));
        }
        return {
          message: "paused successfully",
        };
      } catch (error) {
        return {
          message: "some error occured",
          data: error,
        };
      }
    }),
  deleteMonitorStatus: t.procedure
    .input(z.object({ id: z.string(), urlId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const { id, urlId } = input;
        await db.transaction(async (tx) => {
          await tx
            .update(userMonitors)
            .set({ isActive: false, deletedAt: new Date() })
            .where(eq(userMonitors.id, id));
          await tx.update(globalUrls).set({
            activeMonitorCount: sql`${globalUrls.activeMonitorCount}-1`,
          });
          const [globalUrl] = await tx
            .select()
            .from(globalUrls)
            .where(eq(globalUrls.id, urlId));
          if (globalUrl.activeMonitorCount === 0) {
            await tx.delete(globalUrls).where(eq(globalUrls.id, urlId));
          }
        });
        return {
          message: "Monitor Deleted",
        };
      } catch (error) {
        return {
          message: "some error occured",
          data: error,
        };
      }
    }),
});

export type MonitorProcedure = typeof monitorProcedure;
