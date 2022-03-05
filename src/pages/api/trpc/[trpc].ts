import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import scenesRouter from './scenes'

const appRouter = trpc.router().merge('scenes.', scenesRouter)

export type AppRouter = typeof appRouter

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
})
