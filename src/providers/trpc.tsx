import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query'
import { createTRPCReact, httpBatchLink } from '@trpc/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { Suspense, type ReactNode } from 'react'
import { AppRouter } from '../../trpc/router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
})

export const trpc = createTRPCReact<AppRouter>()

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `/api/trpc`,
      headers: () => {
        const jwt = localStorage.getItem('jwt')?.replaceAll('"', '')
        if (!jwt) return {}

        return {
          authorization: `Bearer ${jwt}`
        }
      }
    }),
  ],
})

type TRPCProviderProps = {
  children: ReactNode | undefined;
}

export function TRPCProvider({ children }: TRPCProviderProps) {
  return (
    <trpc.Provider queryClient={queryClient} client={trpcClient}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <QueryErrorBoundary>
          <Suspense fallback="Loading...">
            {children}
          </Suspense>
        </QueryErrorBoundary>
      </QueryClientProvider>
    </trpc.Provider>
  )
}

type QueryErrorBoundaryProps = {
  children: ReactNode | undefined
}

export function QueryErrorBoundary({ children }: QueryErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} fallbackRender={QueryErrorBoundaryFallback}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

function QueryErrorBoundaryFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div>
      There was an error!
      <button type="button" onClick={() => resetErrorBoundary()}>
        Try again
      </button>
    </div>
  )
}
