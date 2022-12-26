import { createRoot } from 'react-dom/client'
import { StrictMode, Suspense } from 'react'

import { TRPCProvider } from './providers/trpc'
import { Provider as JotaiProvider } from 'jotai'
import { RouterProvider } from 'react-router-dom'
import { router } from './pages/_routes'
import { ThemeProvider } from './providers/theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense>
      <TRPCProvider>
        <JotaiProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </JotaiProvider>
      </TRPCProvider>
    </Suspense>
  </StrictMode>
)
