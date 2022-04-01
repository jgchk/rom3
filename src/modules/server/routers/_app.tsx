import superjson from 'superjson'

import createRouter from '../createRouter'
import accountsRouter from './accounts'
import authRouter from './auth'
import correctionsRouter from './corrections'
import genresRouter from './genres'

const appRouter = createRouter()
  .transformer(superjson)
  .merge('auth.', authRouter)
  .merge('accounts.', accountsRouter)
  .merge('genres.', genresRouter)
  .merge('corrections.', correctionsRouter)

export type AppRouter = typeof appRouter

export default appRouter
