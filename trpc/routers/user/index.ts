import { t } from '../../builder'

import { login } from './login'
import { me } from './me'
import { signup } from './signup'

export const userRouter = t.router({
  user: t.mergeRouters(
    signup,
    login,
    me,
  )
})
