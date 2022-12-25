import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'

import { Auth0Provider } from '@auth0/auth0-react'
import { TRPCProvider } from './providers/trpc'

import App from './App'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
    >
      <TRPCProvider>
        <App />
      </TRPCProvider>
    </Auth0Provider>
  </StrictMode>,
)
