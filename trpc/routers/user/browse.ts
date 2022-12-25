import { t } from '../../builder'
import { prisma } from '../../client/prisma'

export const browse = t.router({
  browse: t.procedure.query(async () => {
    const users = await prisma.user.findMany()

    return users
  })
})
