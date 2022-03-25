import type { GenreType } from '@prisma/client'

import { InferQueryOutput } from '../utils/trpc'

export type { GenreType } from '@prisma/client'

export const genreTypes: GenreType[] = ['META', 'SCENE', 'STYLE', 'TREND']

export const isGenreType = (s: string): s is GenreType =>
  (genreTypes as string[]).includes(s)

export type GenreApiOutput = InferQueryOutput<'genres.byId'>
