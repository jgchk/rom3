import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import scenesRouter from './scenes'
import stylesRouter from './styles'

const appRouter = trpc
  .router()
  .merge('scenes.', scenesRouter)
  .merge('styles.', stylesRouter)

export type AppRouter = typeof appRouter

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
})
