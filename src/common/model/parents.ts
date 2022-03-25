import type { GenreType } from '@prisma/client'

export const genreParentTypes: Record<GenreType, GenreType[]> = {
  META: ['META'],
  SCENE: [],
  STYLE: ['META', 'STYLE'],
  TREND: ['META', 'STYLE'],
}

export const genreChildTypes: Record<GenreType, GenreType[]> = {
  META: ['META', 'STYLE', 'TREND'],
  SCENE: [],
  STYLE: ['STYLE', 'TREND'],
  TREND: [],
}
