import { Container } from '@mui/material'
import { useAtomValue } from 'jotai'
import { Navigate, Outlet } from 'react-router-dom'
import { jwtAtom } from '../../atoms/jwt'

export const AuthRootPage = () => {
  const jwt = useAtomValue(jwtAtom)

  if (jwt) return <Navigate to='/' />

  return (
    <Container maxWidth='sm' sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Outlet />
    </Container>
  )
}
