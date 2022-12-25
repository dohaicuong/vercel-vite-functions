import { NextApiHandler } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Body = {
  user_id: string
  email: string
  name: string
  avatar: string
}

const handler: NextApiHandler = async (request, response) => {
  const body: Body = request.body

  const user = await prisma.user.findUnique({
    where: { email: body.email }
  })
  if (user) return response.status(200).json({ ok: true })

  await prisma.user.create({
    data: {
      externalId: body.user_id,
      email: body.email,
      name: body.name,
      avatar: body.avatar,
    }
  })
  return response.status(200).json({ ok: true })
}

export default handler
