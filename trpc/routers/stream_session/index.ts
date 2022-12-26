import { t } from '../../builder'
import { browse_session } from './browse_session'
import { create_session } from './create_session'

export const streamSessionRouter = t.router({
  stream_session: t.mergeRouters(
    create_session,
    browse_session,
  )
})
