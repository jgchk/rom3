import type { GenreType, InfluenceType } from '@prisma/client'

export const genreInfluencedByTypes: Record<GenreType, GenreType[]> = {
  META: [],
  SCENE: ['SCENE'],
  STYLE: ['STYLE'],
  TREND: ['STYLE', 'TREND'],
}

export const genreInfluencesTypes: Record<GenreType, GenreType[]> = {
  META: [],
  SCENE: ['SCENE'],
  STYLE: ['STYLE', 'TREND'],
  TREND: ['TREND'],
}

export const influenceTypes: InfluenceType[] = ['HISTORICAL', 'SONIC']
