import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { monitorProcedure } from "@/routers/router";
import { mergedRouters } from "@/routers/mergeroutes";
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: mergedRouters,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };
