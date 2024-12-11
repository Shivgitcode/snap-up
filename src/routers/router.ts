import { db } from "@/drizzle/db";
import { monitorRelations, monitors, users } from "@/drizzle/schema";
import { checkWebsitesToMonitor } from "@/actions/monitor";
import { auth } from "@/server/auth";
import { t } from "@/server/server";
import { eq, gt, isNull, or, sql } from "drizzle-orm";
import { z } from "zod";

export const monitorProcedure = t.router({
  createMonitor: t.procedure
    .input(
      z.object({ url: z.string(), name: z.string(), interval: z.number() })
    )
    .mutation(async ({ input }) => {
      const { url, name, interval } = input;
      const curruser = await auth();
      const findUser = await db
        .select()
        .from(users)
        .where(eq(users.email, curruser?.user?.email as string));
      console.log(findUser);
      const createMonitor = await db
        .insert(monitors)
        .values({
          url,
          interval,
          userId: findUser[0].id as string,
          name,
        })
        .returning({
          id: monitors.id,
          url: monitors.url,
        });

      const findMonitorRelation = await db
        .select()
        .from(monitorRelations)
        .where(eq(monitorRelations.id, createMonitor[0].id));

      if (!findMonitorRelation[0]) {
        const createMonitorRelation = await db
          .insert(monitorRelations)
          .values({
            monitorId: createMonitor[0].id,
            userId: findUser[0].id,
          })
          .returning({
            id: monitorRelations.id,
          });
        console.log(createMonitorRelation);
      }

      return {
        message: "monitor created",
        data: createMonitor,
      };
    }),
  getAllWebsites: t.procedure.query(async () => {
    const session = await auth();
    console.log(session);
    const findUser = await db
      .select()
      .from(users)
      .where(eq(users.email, session?.user?.email as string));
    const allMonitors = await db
      .select()
      .from(monitors)
      .where(eq(monitors.userId, findUser[0].id));

    return {
      message: "These are your monitors",
      monitors: allMonitors,
    };
  }),
  getMonitorWebsiteToCheck: t.procedure.query(async () => {
    try {
      const allWebsiteToMonitor = await db
        .select()
        .from(monitors)
        .where(
          or(
            isNull(monitors.latestCheck),
            gt(
              sql`now() - ${monitors.latestCheck}`,
              sql`${monitors.interval} * interval '1 minute'`
            )
          )
        );

      return {
        message: "done",
        data: allWebsiteToMonitor,
      };
    } catch (error) {
      return {
        message: "some error occured",
        data: error,
      };
    }
  }),
  updateMonitor: t.procedure.query(async () => {
    try {
      await checkWebsitesToMonitor();
      return "Function working";
    } catch (error) {
      console.log(error);
    }
  }),
});

export type MonitorProcedure = typeof monitorProcedure;
