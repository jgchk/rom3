import * as trpcNext from '@trpc/server/adapters/next'

import { createContext } from '../../../modules/server/context'
import appRouter from '../../../modules/server/routers/_app'

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
})
