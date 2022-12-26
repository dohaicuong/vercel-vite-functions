import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from './auth/login'
import { AuthRootPage } from './auth/root'
import { SignupPage } from './auth/signup'
import { StreamPage } from './stream'
import { StreamListPage } from './stream-list'
import { RootPage } from './root'

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthRootPage />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
    ]
  },

  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        index: true,
        element: <StreamListPage />
      },
      {
        path: 'streaming',
        element: <StreamPage />
      }
    ]
  },
])
