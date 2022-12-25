import { TRPCError } from '@trpc/server'
import { compare } from 'bcrypt'
import { z } from 'zod'
import { t } from '../../builder'
import { signToken } from '../../client/jwt'
import { prisma } from '../../client/prisma'
import { User } from './model'

export const login = t.router({
  login: t.procedure
    .input(z.object({
      email: z.string(),
      password: z.string(),
    }))
    .output(z.object({
      user: User,
      token: z.string(),
    }))
    .mutation(async ({ input: { email, password }}) => {
      const userExisted = await prisma.user.findUnique({ where: { email }})
      if (!userExisted) throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Wrong credentials!'
      })

      const isMatchPassword = await compare(password, userExisted.password)
      if (!isMatchPassword) throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Wrong credentials!'
      })

      const token = signToken({ user_id: userExisted.id })

      return {
        user: userExisted,
        token,
      }
    })
})
