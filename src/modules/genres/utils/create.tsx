import {
  InferMutationInput,
  InferQueryOutput,
} from '../../../common/utils/trpc'

export type MetaObject = InferQueryOutput<'metas.byId'>
export type SceneObject = InferQueryOutput<'scenes.byId'>
export type StyleObject = InferQueryOutput<'styles.byId'>
export type TrendObject = InferQueryOutput<'trends.byId'>
export type GenreObject = InferQueryOutput<'genres'>[number]

export const isMeta = (o: GenreObject): o is MetaObject => o.type === 'meta'
export const isScene = (o: GenreObject): o is SceneObject => o.type === 'scene'
export const isStyle = (o: GenreObject): o is StyleObject => o.type === 'style'
export const isTrend = (o: GenreObject): o is TrendObject => o.type === 'trend'

export type MetaInput = Omit<
  InferMutationInput<'metas.add'>,
  'alternateNames' | 'parentMetas'
> & { type: 'meta'; alternateNames: string; parentMetas: MetaObject[] }

export type SceneInput = Omit<
  InferMutationInput<'scenes.add'>,
  'alternateNames' | 'influencedByScenes' | 'cultures'
> & {
  type: 'scene'
  alternateNames: string
  influencedByScenes: SceneObject[]
  cultures: string
}
export type StyleInput = Omit<
  InferMutationInput<'styles.add'>,
  | 'alternateNames'
  | 'parentStyles'
  | 'parentMetas'
  | 'influencedByStyles'
  | 'cultures'
> & {
  type: 'style'
  alternateNames: string
  parentStyles: StyleObject[]
  parentMetas: MetaObject[]
  influencedByStyles: StyleObject[]
  cultures: string
}
export type TrendInput = Omit<
  InferMutationInput<'trends.add'>,
  | 'alternateNames'
  | 'parentTrends'
  | 'parentStyles'
  | 'parentMetas'
  | 'influencedByTrends'
  | 'influencedByStyles'
  | 'cultures'
> & {
  type: 'trend'
  alternateNames: string
  parentTrends: TrendObject[]
  parentStyles: StyleObject[]
  parentMetas: MetaObject[]
  influencedByTrends: TrendObject[]
  influencedByStyles: StyleObject[]
  cultures: string
}
export type GenreInput = MetaInput | SceneInput | StyleInput | TrendInput

export type LocationInput =
  InferMutationInput<'scenes.add'>['locations'][number]

const getInfluencedBy = (oldData?: GenreInput): GenreObject[] => {
  if (!oldData) return []
  switch (oldData.type) {
    case 'meta':
      return []
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
    case 'meta':
      return oldData.parentMetas
    case 'scene':
      return []
    case 'style':
      return [...oldData.parentStyles, ...oldData.parentMetas]
    case 'trend':
      return [
        ...oldData.parentTrends,
        ...oldData.parentStyles,
        ...oldData.parentMetas,
      ]
  }
}

const getLocations = (oldData?: GenreInput): LocationInput[] => {
  if (!oldData) return []
  switch (oldData.type) {
    case 'meta':
      return []
    case 'scene':
    case 'style':
    case 'trend':
      return oldData.locations
  }
}

const getCultures = (oldData?: GenreInput): string => {
  if (!oldData) return ''
  switch (oldData.type) {
    case 'meta':
      return ''
    case 'scene':
    case 'style':
    case 'trend':
      return oldData.cultures
  }
}

export const makeLocation = (): LocationInput => ({
  city: '',
  region: '',
  country: '',
})

export const makeMeta = (oldData?: GenreInput): [MetaInput, boolean] => {
  const oldParents = getParents(oldData)
  const oldInfluencedBy = getInfluencedBy(oldData)
  const oldLocations = getLocations(oldData)
  const oldCultures = getCultures(oldData)

  const parentMetas = oldParents.filter(isMeta)

  const lostData =
    parentMetas.length !== oldParents.length ||
    oldInfluencedBy.length > 0 ||
    oldLocations.length > 0 ||
    oldCultures.length > 0

  return [
    {
      type: 'meta',
      name: oldData?.name ?? '',
      alternateNames: oldData?.alternateNames ?? '',
      shortDesc: oldData?.shortDesc ?? '',
      longDesc: oldData?.longDesc ?? '',
      parentMetas,
    },
    lostData,
  ]
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
      locations: getLocations(oldData),
      cultures: getCultures(oldData),
    },
    lostData,
  ]
}

export const makeStyle = (oldData?: GenreInput): [StyleInput, boolean] => {
  const oldParents = getParents(oldData)
  const oldInfluencedBy = getInfluencedBy(oldData)

  const parentStyles = oldParents.filter(isStyle)
  const parentMetas = oldParents.filter(isMeta)
  const influencedByStyles = oldInfluencedBy.filter(isStyle)

  const lostData =
    influencedByStyles.length !== oldInfluencedBy.length ||
    parentStyles.length + parentMetas.length !== oldParents.length

  return [
    {
      type: 'style',
      name: oldData?.name ?? '',
      alternateNames: oldData?.alternateNames ?? '',
      shortDesc: oldData?.shortDesc ?? '',
      longDesc: oldData?.longDesc ?? '',
      parentStyles,
      parentMetas,
      influencedByStyles,
      locations: getLocations(oldData),
      cultures: getCultures(oldData),
    },
    lostData,
  ]
}

export const makeTrend = (oldData?: GenreInput): [TrendInput, boolean] => {
  const oldParents = getParents(oldData)
  const oldInfluencedBy = getInfluencedBy(oldData)

  const parentTrends = oldParents.filter(isTrend)
  const parentStyles = oldParents.filter(isStyle)
  const parentMetas = oldParents.filter(isMeta)
  const influencedByTrends = oldInfluencedBy.filter(isTrend)
  const influencedByStyles = oldInfluencedBy.filter(isStyle)

  const lostData =
    influencedByTrends.length + influencedByStyles.length !==
      oldInfluencedBy.length ||
    parentTrends.length + parentStyles.length + parentMetas.length !==
      oldParents.length

  return [
    {
      type: 'trend',
      name: oldData?.name ?? '',
      alternateNames: oldData?.alternateNames ?? '',
      shortDesc: oldData?.shortDesc ?? '',
      longDesc: oldData?.longDesc ?? '',
      parentTrends,
      parentStyles,
      parentMetas,
      influencedByTrends,
      influencedByStyles,
      locations: getLocations(oldData),
      cultures: getCultures(oldData),
    },
    lostData,
  ]
}

export const makeInput = (
  targetType: GenreType,
  oldData?: GenreInput
): [GenreInput, boolean] => {
  switch (targetType) {
    case 'meta':
      return makeMeta(oldData)
    case 'scene':
      return makeScene(oldData)
    case 'style':
      return makeStyle(oldData)
    case 'trend':
      return makeTrend(oldData)
  }
}

export type GenreType = GenreInput['type']
export const genreTypes: GenreType[] = ['meta', 'scene', 'style', 'trend']
export const isGenreType = (s: string): s is GenreType =>
  (genreTypes as string[]).includes(s)
