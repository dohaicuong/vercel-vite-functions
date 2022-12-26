import { t } from './builder'
import { streamSessionRouter } from './routers/stream_session'
import { userRouter } from './routers/user'

export const appRouter = t.mergeRouters(
  userRouter,
  streamSessionRouter,
)

export type AppRouter = typeof appRouter