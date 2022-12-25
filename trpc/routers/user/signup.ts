import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { t } from '../../builder'
import { prisma } from '../../client/prisma'
import { hash } from 'bcrypt'
import { User } from './model'
import { signToken } from '../../client/jwt'

export const signup = t.router({
  signup: t.procedure
    .input(z.object({
      email: z.string(),
      name: z.string(),
      password: z.string(),
    }))
    .output(z.object({
      user: User,
      token: z.string(),
    }))
    .mutation(async ({ input }) => {
      const userExisted = await prisma.user.findUnique({ where: { email: input.email }})
      if (userExisted) throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Email ${input.email} is existed!`,
      })

      const hashedPassword = await hash(input.password, 10)
      const newUser = await prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          password: hashedPassword,
        }
      })

      const token = signToken({ user_id: newUser.id })

      return {
        user: newUser,
        token,
      }
    })
})