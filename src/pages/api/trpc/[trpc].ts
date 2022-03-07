import { PrismaClient, Scene, Style, Trend } from '@prisma/client'
import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { z } from 'zod'

import scenesRouter, {
  addScene,
  deleteScene,
  editScene,
  getScene,
  SceneInput,
  SceneOutput,
} from './scenes'
import stylesRouter, {
  addStyle,
  deleteStyle,
  editStyle,
  getStyle,
  StyleInput,
  StyleOutput,
} from './styles'
import trendsRouter, {
  addTrend,
  deleteTrend,
  editTrend,
  getTrend,
  TrendInput,
  TrendOutput,
} from './trends'

const prisma = new PrismaClient()

const GenreType = z.union([
  z.literal('scene'),
  z.literal('style'),
  z.literal('trend'),
])

type GenreOutput = SceneOutput | StyleOutput | TrendOutput

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
  .mutation('add', {
    input: z.union([
      z.object({ type: z.literal('scene'), data: SceneInput }),
      z.object({ type: z.literal('style'), data: StyleInput }),
      z.object({ type: z.literal('trend'), data: TrendInput }),
    ]),
    resolve: async ({ input }) => {
      switch (input.type) {
        case 'scene':
          return addScene(input.data)
        case 'style':
          return addStyle(input.data)
        case 'trend':
          return addTrend(input.data)
      }
    },
  })
  .query('get', {
    input: z.object({ type: GenreType, id: z.number() }),
    resolve: async ({ input }): Promise<GenreOutput> => {
      switch (input.type) {
        case 'scene':
          return { ...(await getScene(input.id)), type: 'scene' }
        case 'style':
          return { ...(await getStyle(input.id)), type: 'style' }
        case 'trend':
          return { ...(await getTrend(input.id)), type: 'trend' }
      }
    },
  })
  .mutation('edit', {
    input: z.object({
      type: GenreType,
      id: z.number(),
      data: z.union([
        z.object({
          type: z.literal('scene'),
          data: SceneInput,
        }),
        z.object({
          type: z.literal('style'),
          data: StyleInput,
        }),
        z.object({
          type: z.literal('trend'),
          data: TrendInput,
        }),
      ]),
    }),
    resolve: async ({ input }) => {
      if (input.type !== input.data.type) {
        // switching types
        // TODO: need to handle relations where we're the parent and try to preserve them. warn the user if connections may be wiped
        switch (input.type) {
          case 'scene': {
            await deleteScene(input.id)
            break
          }
          case 'style': {
            await deleteStyle(input.id)
            break
          }
          case 'trend': {
            await deleteTrend(input.id)
            break
          }
        }
        switch (input.data.type) {
          case 'scene':
            return addScene(input.data.data)
          case 'style':
            return addStyle(input.data.data)
          case 'trend':
            return addTrend(input.data.data)
        }
      } else {
        // keeping same type
        switch (input.data.type) {
          case 'scene':
            return editScene(input.id, input.data.data)
          case 'style':
            return editStyle(input.id, input.data.data)
          case 'trend':
            return editTrend(input.id, input.data.data)
        }
      }
    },
  })
  .mutation('delete', {
    input: z.object({ type: GenreType, id: z.number() }),
    resolve: async ({ input }) => {
      switch (input.type) {
        case 'scene':
          return deleteScene(input.id)
        case 'style':
          return deleteStyle(input.id)
        case 'trend':
          return deleteTrend(input.id)
      }
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
