import { t } from "@/server/server";
import { z } from "zod";
import axios from "axios"

export const appRouter = t.router({
    getStatus: t.procedure.input(z.object({ url: z.string().url(), interval: z.number(), name: z.string() })).query(async ({ input }) => {
        const { url, interval, name } = input
        const response = await axios.get(url);
        if (response.status == 200) {
            return { message: "up", isUp: true }
        }
        else {
            return { message: "down", isUp: false }
        }

    })
})

export type AppRouter = typeof appRouter