import createRouter from '../createRouter'
import allRouter from './all'
import correctionsRouter from './corrections'
import metasRouter from './metas'
import scenesRouter from './scenes'
import stylesRouter from './styles'
import trendsRouter from './trends'

const appRouter = createRouter()
  .merge(allRouter)
  .merge('metas.', metasRouter)
  .merge('scenes.', scenesRouter)
  .merge('styles.', stylesRouter)
  .merge('trends.', trendsRouter)
  .merge('corrections.', correctionsRouter)

export type AppRouter = typeof appRouter

export default appRouter
