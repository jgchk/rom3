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
  'alternateNames' | 'influencedBy'
> & {
  type: 'scene'
  alternateNames: string
  influencedBy: SceneObject[]
}
export type StyleInput = Omit<
  InferMutationInput<'styles.add'>,
  'alternateNames' | 'influencedBy' | 'parents'
> & {
  type: 'style'
  alternateNames: string
  influencedBy: StyleObject[]
  parents: StyleObject[]
}
export type TrendInput = Omit<
  InferMutationInput<'trends.add'>,
  | 'alternateNames'
  | 'trendInfluencedBy'
  | 'styleInfluencedBy'
  | 'parentTrends'
  | 'parentStyles'
> & {
  type: 'trend'
  alternateNames: string
  trendInfluencedBy: TrendObject[]
  styleInfluencedBy: StyleObject[]
  parentTrends: TrendObject[]
  parentStyles: StyleObject[]
}
export type GenreInput = SceneInput | StyleInput | TrendInput

const getInfluencedBy = (oldData?: GenreInput): GenreObject[] => {
  if (!oldData) return []
  switch (oldData.type) {
    case 'scene':
    case 'style':
      return oldData.influencedBy
    case 'trend':
      return [...oldData.styleInfluencedBy, ...oldData.trendInfluencedBy]
  }
}

const getParents = (oldData?: GenreInput): GenreObject[] => {
  if (!oldData) return []
  switch (oldData.type) {
    case 'scene':
      return []
    case 'style':
      return oldData.parents
    case 'trend':
      return [...oldData.parentTrends, ...oldData.parentStyles]
  }
}

export const makeScene = (oldData?: GenreInput): [SceneInput, boolean] => {
  const oldInfluencedBy = getInfluencedBy(oldData)
  const influencedBy = oldInfluencedBy.filter(isScene)

  const oldParents = getParents(oldData)

  const lostData =
    influencedBy.length !== oldInfluencedBy.length || oldParents.length > 0

  return [
    {
      type: 'scene',
      name: oldData?.name ?? '',
      alternateNames: oldData?.alternateNames ?? '',
      shortDesc: oldData?.shortDesc ?? '',
      longDesc: oldData?.longDesc ?? '',
      influencedBy,
    },
    lostData,
  ]
}

export const makeStyle = (oldData?: GenreInput): [StyleInput, boolean] => {
  const oldInfluencedBy = getInfluencedBy(oldData)
  const influencedBy = oldInfluencedBy.filter(isStyle)

  const oldParents = getParents(oldData)
  const parents = oldParents.filter(isStyle)

  const lostData =
    influencedBy.length !== oldInfluencedBy.length ||
    parents.length !== oldParents.length

  return [
    {
      type: 'style',
      name: oldData?.name ?? '',
      alternateNames: oldData?.alternateNames ?? '',
      shortDesc: oldData?.shortDesc ?? '',
      longDesc: oldData?.longDesc ?? '',
      influencedBy,
      parents,
    },
    lostData,
  ]
}

export const makeTrend = (oldData?: GenreInput): [TrendInput, boolean] => {
  const oldInfluencedBy = getInfluencedBy(oldData)
  const trendInfluencedBy = oldInfluencedBy.filter(isTrend)
  const styleInfluencedBy = oldInfluencedBy.filter(isStyle)

  const oldParents = getParents(oldData)
  const parentTrends = oldParents.filter(isTrend)
  const parentStyles = oldParents.filter(isStyle)

  const lostData =
    trendInfluencedBy.length + styleInfluencedBy.length !==
      oldInfluencedBy.length ||
    parentTrends.length + parentStyles.length !== oldParents.length

  return [
    {
      type: 'trend',
      name: oldData?.name ?? '',
      alternateNames: oldData?.alternateNames ?? '',
      shortDesc: oldData?.shortDesc ?? '',
      longDesc: oldData?.longDesc ?? '',
      trendInfluencedBy,
      styleInfluencedBy,
      parentTrends,
      parentStyles,
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
