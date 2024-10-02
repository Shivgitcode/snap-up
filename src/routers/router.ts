import { t } from "@/server/server";
import { z } from "zod";
import axios from "axios"
import { db } from "@/drizzle/db";
import { monitors, users } from "@/drizzle/schema";
import { auth } from "@/server/auth";
import { eq } from "drizzle-orm";

export const appRouter = t.router({
    getStatus: t.procedure.input(z.object({ url: z.string(), interval: z.number(), name: z.string() })).mutation(async ({ input }) => {
        const { url, interval, name } = input
        const response = await axios.get(url);
        console.log("hello every one")
        if (response.status == 200) {
            return { message: "up", isUp: true }
        }
        else {
            return { message: "down", isUp: false }
        }

    }),
    createMonitor: t.procedure.input(z.object({ url: z.string(), interval: z.number(), name: z.string() })).mutation(async ({ input }) => {
        const { url, interval, name } = input;
        const session = await auth();
        console.log(session)
        const found = await db.select().from(users).where(eq(users.email, session?.user?.email as string))
        console.log(found)

        const newmonitor = await db.insert(monitors).values({
            url,
            time: interval,
            name,
            userId: found[0].id

        }).returning({
            id: monitors.id
        })

        return {
            message: "created monitor",
            data: newmonitor
        }

    }),
    getAllMonitors: t.procedure.query(async () => {
        try {
            const all = await db.select().from(monitors);

            return { message: "fetched all monitors", data: all }

        }
        catch (error: any) {
            return { message: "failed to fetch", data: error.message }
        }


    })
})

export type AppRouter = typeof appRouter