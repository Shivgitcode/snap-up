import { MergedProcedure } from "@/routers/mergeroutes";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<MergedProcedure>({});
