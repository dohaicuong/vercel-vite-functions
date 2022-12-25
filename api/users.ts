import { NextApiHandler } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler: NextApiHandler = async (_request, response) => {
  const users = await prisma.user.findMany()

  return response.status(200).json({ users })
}

export default handler
