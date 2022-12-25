import { initTRPC } from '@trpc/server'
import { NextContext } from './context'
import { AuthContext } from './middleware/auth'

type Context =
  & NextContext
  & AuthContext

export const t = initTRPC
  .context<Context>()
  .create()
