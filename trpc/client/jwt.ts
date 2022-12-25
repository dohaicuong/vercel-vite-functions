import { sign, verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export type JwtPayload = {
  user_id: string
}

export const signToken = (payload: JwtPayload) => sign(payload, JWT_SECRET)

type VerifyTokenPayload =
 | { name: 'JsonWebTokenError', message: string }
 | { name: 'NotBeforeError', message: string }
 | { name: 'TokenExpiredError', message: string }
 | { name: 'VerifyTokenSuccess', payload: JwtPayload }

export const verifyToken = (token: string) => {
  return new Promise<VerifyTokenPayload>(resolve => {
    verify(token, JWT_SECRET, (error, payload) => {
      if (error) {
        return resolve({ name: error.name as any, message: error.message })
      }

      return resolve({
        name: 'VerifyTokenSuccess',
        payload: payload as JwtPayload,
      })
    })
  })
}
