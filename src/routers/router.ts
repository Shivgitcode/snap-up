import { t } from "@/server/server";
import { z } from "zod";
import axios from "axios"
import { db } from "@/drizzle/db";
import { monitors } from "@/drizzle/schema";
import { auth } from "@/server/auth";

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
        const newmonitor = await db.insert(monitors).values({
            url,
            time: interval,
            name,

        }).returning({
            id: monitors.id
        })

        return {
            message: "created monitor",
            data: newmonitor
        }

    })
})

export type AppRouter = typeof appRouter