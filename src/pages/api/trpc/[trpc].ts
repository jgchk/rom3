import { PrismaClient, Scene, Style, Trend } from '@prisma/client'
import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { z } from 'zod'
import scenesRouter from './scenes'
import stylesRouter from './styles'
import trendsRouter from './trends'

const prisma = new PrismaClient()

const GenreType = z.union([
  z.literal('scene'),
  z.literal('style'),
  z.literal('trend'),
])

const appRouter = trpc
  .router()
  .query('genres', {
    input: z.object({
      type: z.array(GenreType),
    }),
    resolve: async ({ input }) => {
      const results = await Promise.all(
        [...new Set(input.type)].map(
          async (
            type_
          ): Promise<
            (
              | (Scene & { type: 'scene' })
              | (Style & { type: 'style' })
              | (Trend & { type: 'trend' })
            )[]
          > => {
            switch (type_) {
              case 'scene': {
                const scenes = await prisma.scene.findMany()
                return scenes.map((scene) => ({ ...scene, type: 'scene' }))
              }
              case 'style': {
                const styles = await prisma.style.findMany()
                return styles.map((style) => ({ ...style, type: 'style' }))
              }
              case 'trend': {
                const trends = await prisma.trend.findMany()
                return trends.map((trend) => ({ ...trend, type: 'trend' }))
              }
            }
          }
        )
      )
      return results.flat()
    },
  })
  .merge('scenes.', scenesRouter)
  .merge('styles.', stylesRouter)
  .merge('trends.', trendsRouter)

export type AppRouter = typeof appRouter

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
})
