import { z } from 'zod'

import createRouter from '../createRouter'
import {
  addMeta,
  deleteMeta,
  editMeta,
  getMeta,
  getMetas,
  MetaInput,
} from './metas'
import {
  addScene,
  deleteScene,
  editScene,
  getScene,
  getScenes,
  SceneInput,
} from './scenes'
import {
  addStyle,
  deleteStyle,
  editStyle,
  getStyle,
  getStyles,
  StyleInput,
} from './styles'
import {
  addTrend,
  deleteTrend,
  editTrend,
  getTrend,
  getTrends,
  TrendInput,
} from './trends'

const GenreType = z.union([
  z.literal('meta'),
  z.literal('scene'),
  z.literal('style'),
  z.literal('trend'),
])

export const allRouter = createRouter()
  .query('genres', {
    input: z.object({
      type: z.array(GenreType),
    }),
    resolve: async ({ input }) => {
      const results = await Promise.all(
        [...new Set(input.type)].map(async (type_) => {
          switch (type_) {
            case 'meta':
              return getMetas()
            case 'scene':
              return getScenes()
            case 'style':
              return getStyles()
            case 'trend':
              return getTrends()
          }
        })
      )
      return results.flat()
    },
  })
  .mutation('add', {
    input: z.union([
      z.object({ type: z.literal('meta'), data: MetaInput }),
      z.object({ type: z.literal('scene'), data: SceneInput }),
      z.object({ type: z.literal('style'), data: StyleInput }),
      z.object({ type: z.literal('trend'), data: TrendInput }),
    ]),
    resolve: async ({ input }) => {
      switch (input.type) {
        case 'meta':
          return addMeta(input.data)
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
    resolve: async ({ input }) => {
      switch (input.type) {
        case 'meta':
          return getMeta(input.id)
        case 'scene':
          return getScene(input.id)
        case 'style':
          return getStyle(input.id)
        case 'trend':
          return getTrend(input.id)
      }
    },
  })
  .mutation('edit', {
    input: z.object({
      type: GenreType,
      id: z.number(),
      data: z.union([
        z.object({ type: z.literal('meta'), data: MetaInput }),
        z.object({ type: z.literal('scene'), data: SceneInput }),
        z.object({ type: z.literal('style'), data: StyleInput }),
        z.object({ type: z.literal('trend'), data: TrendInput }),
      ]),
    }),
    resolve: async ({ input }) => {
      if (input.type !== input.data.type) {
        // switching types
        // TODO: need to handle relations where we're the parent and try to preserve them. warn the user if connections may be wiped
        switch (input.type) {
          case 'meta': {
            await deleteMeta(input.id)
            break
          }
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
          case 'meta':
            return addMeta(input.data.data)
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
          case 'meta':
            return editMeta(input.id, input.data.data)
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
        case 'meta':
          return deleteMeta(input.id)
        case 'scene':
          return deleteScene(input.id)
        case 'style':
          return deleteStyle(input.id)
        case 'trend':
          return deleteTrend(input.id)
      }
    },
  })

export default allRouter
