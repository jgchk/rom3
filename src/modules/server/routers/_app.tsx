import createRouter from '../createRouter'
import correctionsRouter from './corrections'
import genresRouter from './genres'

const appRouter = createRouter()
  .merge('genres.', genresRouter)
  .merge('corrections.', correctionsRouter)

export type AppRouter = typeof appRouter

export default appRouter
