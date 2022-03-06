import { Scene, Style, Trend } from '@prisma/client'

import { InferMutationInput } from './trpc'

export type SceneObject = Scene & { type: 'scene' }
export type StyleObject = Style & { type: 'style' }
export type TrendObject = Trend & { type: 'trend' }
export type GenreObject = SceneObject | StyleObject | TrendObject

export const isScene = (o: GenreObject): o is SceneObject => o.type === 'scene'
export const isStyle = (o: GenreObject): o is StyleObject => o.type === 'style'
export const isTrend = (o: GenreObject): o is TrendObject => o.type === 'trend'

export type SceneInput = Omit<
  InferMutationInput<'scenes.add'>,
  'alternateNames' | 'influencedByScenes'
> & {
  type: 'scene'
  alternateNames: string
  influencedByScenes: SceneObject[]
}
export type StyleInput = Omit<
  InferMutationInput<'styles.add'>,
  'alternateNames' | 'parentStyles' | 'influencedByStyles'
> & {
  type: 'style'
  alternateNames: string
  parentStyles: StyleObject[]
  influencedByStyles: StyleObject[]
}
export type TrendInput = Omit<
  InferMutationInput<'trends.add'>,
  | 'alternateNames'
  | 'parentTrends'
  | 'parentStyles'
  | 'influencedByTrends'
  | 'influencedByStyles'
> & {
  type: 'trend'
  alternateNames: string
  parentTrends: TrendObject[]
  parentStyles: StyleObject[]
  influencedByTrends: TrendObject[]
  influencedByStyles: StyleObject[]
}
export type GenreInput = SceneInput | StyleInput | TrendInput

const getInfluencedBy = (oldData?: GenreInput): GenreObject[] => {
  if (!oldData) return []
  switch (oldData.type) {
    case 'scene':
      return oldData.influencedByScenes
    case 'style':
      return oldData.influencedByStyles
    case 'trend':
      return [...oldData.influencedByTrends, ...oldData.influencedByStyles]
  }
}

const getParents = (oldData?: GenreInput): GenreObject[] => {
  if (!oldData) return []
  switch (oldData.type) {
    case 'scene':
      return []
    case 'style':
      return oldData.parentStyles
    case 'trend':
      return [...oldData.parentTrends, ...oldData.parentStyles]
  }
}

export const makeScene = (oldData?: GenreInput): [SceneInput, boolean] => {
  const oldParents = getParents(oldData)

  const oldInfluencedBy = getInfluencedBy(oldData)
  const influencedByScenes = oldInfluencedBy.filter(isScene)

  const lostData =
    influencedByScenes.length !== oldInfluencedBy.length ||
    oldParents.length > 0

  return [
    {
      type: 'scene',
      name: oldData?.name ?? '',
      alternateNames: oldData?.alternateNames ?? '',
      shortDesc: oldData?.shortDesc ?? '',
      longDesc: oldData?.longDesc ?? '',
      influencedByScenes,
    },
    lostData,
  ]
}

export const makeStyle = (oldData?: GenreInput): [StyleInput, boolean] => {
  const oldParents = getParents(oldData)
  const parentStyles = oldParents.filter(isStyle)

  const oldInfluencedBy = getInfluencedBy(oldData)
  const influencedByStyles = oldInfluencedBy.filter(isStyle)

  const lostData =
    influencedByStyles.length !== oldInfluencedBy.length ||
    parentStyles.length !== oldParents.length

  return [
    {
      type: 'style',
      name: oldData?.name ?? '',
      alternateNames: oldData?.alternateNames ?? '',
      shortDesc: oldData?.shortDesc ?? '',
      longDesc: oldData?.longDesc ?? '',
      parentStyles,
      influencedByStyles,
    },
    lostData,
  ]
}

export const makeTrend = (oldData?: GenreInput): [TrendInput, boolean] => {
  const oldParents = getParents(oldData)
  const parentTrends = oldParents.filter(isTrend)
  const parentStyles = oldParents.filter(isStyle)

  const oldInfluencedBy = getInfluencedBy(oldData)
  const influencedByTrends = oldInfluencedBy.filter(isTrend)
  const influencedByStyles = oldInfluencedBy.filter(isStyle)

  const lostData =
    influencedByTrends.length + influencedByStyles.length !==
      oldInfluencedBy.length ||
    parentTrends.length + parentStyles.length !== oldParents.length

  return [
    {
      type: 'trend',
      name: oldData?.name ?? '',
      alternateNames: oldData?.alternateNames ?? '',
      shortDesc: oldData?.shortDesc ?? '',
      longDesc: oldData?.longDesc ?? '',
      parentTrends,
      parentStyles,
      influencedByTrends,
      influencedByStyles,
    },
    lostData,
  ]
}

export const makeInput = (
  targetType: GenreType,
  oldData?: GenreInput
): [GenreInput, boolean] => {
  switch (targetType) {
    case 'scene':
      return makeScene(oldData)
    case 'style':
      return makeStyle(oldData)
    case 'trend':
      return makeTrend(oldData)
  }
}

export type GenreType = GenreInput['type']
export const genreTypes: GenreType[] = ['scene', 'style', 'trend']
export const isGenreType = (s: string): s is GenreType =>
  (genreTypes as string[]).includes(s)
