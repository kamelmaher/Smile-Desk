import { QueryClient } from "@tanstack/react-query"

type QueryError = {
    response?: {
        status?: number
    }
    status?: number
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retryOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: (failureCount, error) => {
                const queryError = error as QueryError
                const status = queryError.response?.status ?? queryError.status

                if (status === 402 || status === 403) {
                    return false
                }

                return failureCount < 3
            },
        },
    },
})