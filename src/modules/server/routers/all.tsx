import { z } from 'zod'

import createRouter from '../createRouter'
import {
  addGenre,
  deleteGenre,
  editGenre,
  getGenre,
  getGenres,
} from '../utils/genres'
import { getGenreDataFromRym } from '../utils/import'
import { GenreApiInput } from '../utils/validators'
import { GenreTypeInput } from '../utils/validators/misc'

export const allRouter = createRouter()
  .query('genres', {
    input: z.object({
      type: z.array(GenreTypeInput),
    }),
    resolve: async ({ input }) => {
      // TODO: return all if no input type passed in
      const results = await Promise.all(
        [...new Set(input.type)].map((type) => getGenres(type))
      )
      return results.flat()
    },
  })
  .mutation('add', {
    input: GenreApiInput,
    resolve: async ({ input }) => addGenre(input),
  })
  .query('get', {
    input: z.object({ type: GenreTypeInput, id: z.number() }),
    resolve: async ({ input }) => getGenre(input.type, input.id),
  })
  .mutation('edit', {
    input: z.object({
      type: GenreTypeInput,
      id: z.number(),
      data: GenreApiInput,
    }),
    resolve: async ({ input }) => editGenre(input.type, input.id, input.data),
  })
  .mutation('delete', {
    input: z.object({ type: GenreTypeInput, id: z.number() }),
    resolve: async ({ input }) => deleteGenre(input.type, input.id),
  })
  .mutation('import', {
    input: z.object({ url: z.string() }),
    resolve: async ({ input }) => {
      const data = await getGenreDataFromRym(input.url)
      return addGenre(data)
    },
  })

export default allRouter
