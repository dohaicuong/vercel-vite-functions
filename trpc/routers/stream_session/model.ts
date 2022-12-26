import { z } from "zod";

export const StreamSession = z.object({
  id: z.string(),
  name: z.string(),
  playbackUrl: z.string(),
  createdAt: z.date(),
  streamByUserId: z.string(),
})
