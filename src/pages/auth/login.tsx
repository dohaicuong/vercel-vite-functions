import { Button, Container, Paper, Stack, TextField, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export const LoginPage = () => {
  return (
    <Container maxWidth='sm' sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper sx={{ minWidth: 400, py: 2, px: 1 }}>
        <Stack spacing={2}>
          <Typography
            variant='h5'
            align='center'
            mb={2}
          >
            Sign in to your account
          </Typography>
          <TextField
            label='Email'
          />
          <TextField
            label='Password'
          />
          <Typography variant='subtitle1' component={Link} to='signup'>
            Don't have an account?
          </Typography>
          <Button variant='contained' size='large'>
            Login
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}
