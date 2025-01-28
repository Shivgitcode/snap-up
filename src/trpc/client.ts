import { MergedProcedure } from "@/routers/mergeroutes";
import { MonitorProcedure } from "@/routers/router";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<MergedProcedure>({});
