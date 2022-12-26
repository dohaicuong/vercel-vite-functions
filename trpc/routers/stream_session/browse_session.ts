import { z } from "zod"
import { t } from "../../builder"
import { prisma } from "../../client/prisma"
import { StreamSession } from "./model"

export const browse_session = t.router({
  browse_session: t.procedure
    .output(z.array(StreamSession))
    .query(async () => {
      const sessions = await prisma.streamSession.findMany()

      return sessions
    })
})
