import { TRPCError } from '@trpc/server'
import { t } from '../builder'
import { JwtPayload, verifyToken } from '../client/jwt'

export type AuthContext = {
  jwt?: {
    token: string,
    payload: JwtPayload
  }
}

export const auth = t.middleware(async ({ ctx, next }) => {
  const auth = ctx.req.headers.authorization
  
  const isBearerToken = auth?.startsWith('Bearer ')
  if (!isBearerToken) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  
  const jwt = auth?.replace('Bearer ', '')
  if (!jwt) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  const jwtPayload = await verifyToken(jwt)
  if (jwtPayload.name !== 'VerifyTokenSuccess') {
    console.log(jwtPayload)
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: {
      ...ctx,
      jwt: {
        token: jwt,
        payload: jwtPayload.payload
      }
    }
  })
})
