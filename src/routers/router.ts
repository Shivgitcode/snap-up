import { t } from "@/server/server";

export const appRouter = t.router({
    getStatus: t.procedure.query(() => {
        return { webstatus: "up" }
    })
})

export type AppRouter = typeof appRouter