import { Button, Container, Paper, Stack, Typography } from '@mui/material'
import { inferRouterInputs } from '@trpc/server'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { AppRouter } from '../../../trpc/router'
import { RHFTextField } from '../../components/RHFTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '../../providers/trpc'
import { useSnackbar } from 'notistack'
import { useSetAtom } from 'jotai'
import { jwtAtom } from '../../atoms/jwt'

type LoginInput = inferRouterInputs<AppRouter>['user']['login']
const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const LoginPage = () => {
  const { enqueueSnackbar } = useSnackbar()
  const setJwt = useSetAtom(jwtAtom)
  const navigate = useNavigate()

  const { mutateAsync: login, isLoading: isMutating } = trpc.user.login.useMutation()

  const { control, handleSubmit } = useForm<LoginInput>({
    resolver: zodResolver(LoginInputSchema)
  })
  const onSubmit: SubmitHandler<LoginInput> = data => {
    login(data, {
      onError: error => enqueueSnackbar(error.message, { variant: 'error' }),
      onSuccess: ({ user, token }) => {
        enqueueSnackbar(`Welcome ${user.name}`, { variant: 'success' })
        setJwt(token)
        navigate('/')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper sx={{ minWidth: 400, py: 4, px: 3 }}>
        <Stack spacing={2}>
          <Typography
            variant='h5'
            align='center'
            mb={2}
          >
            Sign in to your account
          </Typography>
          <RHFTextField
            control={control}
            name='email'
            label='Email'
            disabled={isMutating}
          />
          <RHFTextField
            control={control}
            name='password'
            label='Password'
            type='password'
            disabled={isMutating}
          />
          <Typography variant='subtitle1' component={Link} to='signup'>
            Don't have an account?
          </Typography>
          <Button
            variant='contained'
            size='large'
            type='submit'
            disabled={isMutating}
          >
            Login
          </Button>
        </Stack>
      </Paper>
    </form>
  )
}
