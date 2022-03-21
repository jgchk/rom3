import type { GenreType } from '@prisma/client'

export type { GenreType } from '@prisma/client'

export const genreTypes: GenreType[] = ['META', 'SCENE', 'STYLE', 'TREND']

export const isGenreType = (s: string): s is GenreType =>
  (genreTypes as string[]).includes(s)
