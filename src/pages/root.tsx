import { useAtomValue } from 'jotai'
import { Navigate, Outlet } from 'react-router-dom'
import { jwtAtom } from '../atoms/jwt'

export const RootPage = () => {
  const jwt = useAtomValue(jwtAtom)

  if (!jwt) return <Navigate to='/auth' />

  return <Outlet />
}
