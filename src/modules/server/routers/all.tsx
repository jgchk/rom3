import { z } from 'zod'

import createRouter from '../createRouter'
import { GenreInput, GenreTypeInput } from '../utils/validators'
import { addMeta, deleteMeta, editMeta, getMeta, getMetas } from './metas'
import { addScene, deleteScene, editScene, getScene, getScenes } from './scenes'
import { addStyle, deleteStyle, editStyle, getStyle, getStyles } from './styles'
import { addTrend, deleteTrend, editTrend, getTrend, getTrends } from './trends'

export const allRouter = createRouter()
  .query('genres', {
    input: z.object({
      type: z.array(GenreTypeInput),
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
    input: GenreInput,
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
    input: z.object({ type: GenreTypeInput, id: z.number() }),
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
      type: GenreTypeInput,
      id: z.number(),
      data: GenreInput,
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
    input: z.object({ type: GenreTypeInput, id: z.number() }),
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
