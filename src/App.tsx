import { Suspense, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { trpc } from './providers/trpc'
import { useAuth0 } from '@auth0/auth0-react'

function App() {
  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <ClickCountButton />
        <AuthUser />
        <Suspense fallback={<p>Loading...</p>}>
          <UserCount />
        </Suspense>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App

export const ClickCountButton = () => {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount((count) => count + 1)}>
      count is {count}
    </button>
  )
}

export const UserCount = () => {
  const { data: users } = trpc.user.browse.useQuery()

  return (
    <p>
      There are {users?.length} users
    </p>
  )
}

export const AuthUser = () => {
  const { isAuthenticated, isLoading, user } = useAuth0()

  if (isLoading) return <p>Loading...</p>

  return (
    <div className='container mx-auto'>
      <div className="flex flex-col justify-center">
        <p className='text-center'>
          {user?.email}
        </p>
        {isAuthenticated ? <LogoutButton /> : <LoginButton />}
      </div>
    </div>
  )
}

function LoginButton() {
  const { loginWithRedirect } = useAuth0()

  return (
    <button onClick={() => loginWithRedirect()}>
      Log in
    </button>
  )
}

function LogoutButton() {
  const { logout } = useAuth0()

  return (
    <button onClick={() => logout({ returnTo: window.location.origin })}>
      Log out
    </button>
  )
}
