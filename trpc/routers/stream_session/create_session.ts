import { z } from 'zod'
import { t } from '../../builder'
import { auth } from '../../middleware/auth'
import { prisma } from '../../client/prisma'
import { StreamSession } from "./model"
import { createCFStreamSession } from "../../client/cloudflare"

export const create_session = t.router({
  create_session: t.procedure
    .use(auth)
    .input(z.object({
      name: z.string()
    }))
    .output(z.object({
      streamSession: StreamSession,
      streamUrl: z.string()
    }))
    .mutation(async ({ input, ctx: { jwt }}) => {
      const cfStreamSession = await createCFStreamSession()

      const stream_session = await prisma.streamSession.create({
        data: {
          name: input.name,
          streamUrl: cfStreamSession.result.webRTC.url,
          playbackUrl: cfStreamSession.result.webRTCPlayback.url,
          streamByUserId: jwt.payload.user_id,
        }
      })

      return {
        streamSession: stream_session,
        streamUrl: stream_session.streamUrl,
      }
    })
})
