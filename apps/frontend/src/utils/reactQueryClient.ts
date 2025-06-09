import { QueryCache, QueryClient } from '@tanstack/react-query';

const cache = new QueryCache();

const TEN_MINUTES = 1000 * 60 * 10;
// Create a client
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnReconnect: true,
            staleTime: TEN_MINUTES,
            gcTime: Infinity,
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
    queryCache: cache,
});
