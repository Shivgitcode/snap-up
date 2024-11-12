import { db } from "@/drizzle/db";
import { monitorRelations, monitors } from "@/drizzle/schema";
import { auth } from "@/server/auth";
import { t } from "@/server/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

const monitorProcedure = t.router({
    createMonitor: t.procedure.input(z.object({ url: z.string(), name: z.string(), interval: z.number() })).mutation(async ({ input }) => {
        const { url, name, interval } = input
        const curruser = await auth()
        const createMonitor = await db.insert(monitors).values({
            url,
            interval,
            userId: curruser?.user?.id as string,
            name
        }).returning({
            id: monitors.id
        })
        const findMonitorRelation = await db.select().from(monitorRelations).where(eq(monitorRelations.id, createMonitor[0].id))

        if (!findMonitorRelation[0]) {
            const createMonitorRelation = await db.insert(monitorRelations).values({
                monitorId: createMonitor[0].id,
                userId: curruser?.user?.id as string
            }).returning({
                id: monitorRelations.id
            })
            console.log(createMonitorRelation)

        }

        return {
            message: "monitor created",
            data: findMonitorRelation,

        }


    })

})