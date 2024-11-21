import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { monitorProcedure } from '@/routers/router';
const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: monitorProcedure,
        createContext: () => ({}),
    });

export { handler as GET, handler as POST };