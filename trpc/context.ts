import { inferAsyncReturnType } from '@trpc/server'
import { CreateNextContextOptions } from '@trpc/server/adapters/next'

export async function createContext({ req }: CreateNextContextOptions) {
  return { req }
}

export type NextContext = inferAsyncReturnType<typeof createContext>