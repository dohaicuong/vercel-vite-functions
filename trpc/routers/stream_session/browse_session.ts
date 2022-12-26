import fetch from 'cross-fetch'
import { z } from 'zod'
import { t } from '../../builder'
import { prisma } from '../../client/prisma'
import { StreamSession } from './model'

export const browse_session = t.router({
  browse_session: t.procedure
    .output(z.array(StreamSession))
    .query(async () => {
      const sessions = await prisma.streamSession.findMany()

      const cfLiveInputs = await Promise.all(sessions.map(session => {
        return fetch(
          `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs/${session.externalId}`,
          {
            headers: {
              authorization: `Bearer ${process.env.CLOUDFLARE_STREAM_TOKEN}`
            }
          }
        )
        .then(res => res.json())
        .then(input => input.result.status)
      }))
      
      console.log(cfLiveInputs)

      return sessions
    })
})
