import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Container, Paper, Stack, Typography } from '@mui/material'
import { inferRouterInputs } from '@trpc/server'
import { useSetAtom } from 'jotai'
import { useSnackbar } from 'notistack'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { AppRouter } from '../../../trpc/router'
import { jwtAtom } from '../../atoms/jwt'
import { RHFTextField } from '../../components/RHFTextField'
import { trpc } from '../../providers/trpc'

type SignupInput = inferRouterInputs<AppRouter>['user']['signup']
const SignupInputSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
})

export const SignupPage = () => {
  const { enqueueSnackbar } = useSnackbar()
  const setJwt = useSetAtom(jwtAtom)
  const navigate = useNavigate()

  const { mutateAsync: signup, isLoading: isMutating } = trpc.user.signup.useMutation()

  const { control, handleSubmit } = useForm<SignupInput>({
    resolver: zodResolver(SignupInputSchema)
  })
  const onSubmit: SubmitHandler<SignupInput> = data => {
    signup(data, {
      onError: error => enqueueSnackbar(error.message, { variant: 'error' }),
      onSuccess: ({ user, token }) => {
        enqueueSnackbar(`Thank you ${user.name} for signing up!`, { variant: 'success' })
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
            Create new account
          </Typography>
          <RHFTextField
            control={control}
            name='name'
            label='Name'
            disabled={isMutating}
          />
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
            login instead?
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
