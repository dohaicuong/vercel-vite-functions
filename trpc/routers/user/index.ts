import { t } from '../../builder'

import { browse } from './browse'

export const userRouter = t.router({
  user: t.mergeRouters(
    browse
  )
})
