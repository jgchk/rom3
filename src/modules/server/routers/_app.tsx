import createRouter from '../createRouter'
import authRouter from './auth'
import correctionsRouter from './corrections'
import genresRouter from './genres'

const appRouter = createRouter()
  .merge('auth.', authRouter)
  .merge('genres.', genresRouter)
  .merge('corrections.', correctionsRouter)

export type AppRouter = typeof appRouter

export default appRouter
