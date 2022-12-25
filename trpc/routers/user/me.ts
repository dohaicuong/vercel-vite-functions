import { TRPCError } from '@trpc/server'
import { t } from '../../builder'
import { prisma } from '../../client/prisma'
import { auth } from '../../middleware/auth'
import { User } from './model'

export const me = t.router({
  me: t.procedure
    .use(auth)
    .output(User)
    .query(async ({ ctx: { jwt } }) => {
      const user = await prisma.user.findUnique({
        where: { id: jwt.payload.user_id }
      })
      if (!user) throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        cause: {
          user_id: jwt.payload.user_id
        }
      })

      return user
    })
})
