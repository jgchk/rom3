import {
  InferMutationInput,
  InferQueryOutput,
} from '../../../../common/utils/trpc'
import {
  GenreOutput,
  GenreUiState,
  getCultures,
  getInfluencedBy,
  getLocations,
  getParents,
  SimpleGenreOutput,
} from '.'
import { isSimpleMetaOutput, SimpleMetaOutput } from './metas'
import { isSimpleStyleOutput, SimpleStyleOutput } from './styles'

export type TrendInput = InferMutationInput<'trends.add'>
export type TrendOutput = InferQueryOutput<'trends.byId'>
export type SimpleTrendOutput = TrendOutput['parentTrends'][number] & {
  type: 'trend'
}

export const isTrendOutput = (o: GenreOutput): o is TrendOutput =>
  o.type === 'trend'
export const isSimpleTrendOutput = (
  o: SimpleGenreOutput
): o is SimpleTrendOutput => o.type === 'trend'

export type TrendUiState = Omit<
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
  parentTrends: SimpleTrendOutput[]
  parentStyles: SimpleStyleOutput[]
  parentMetas: SimpleMetaOutput[]
  influencedByTrends: SimpleTrendOutput[]
  influencedByStyles: SimpleStyleOutput[]
  cultures: string
}

export const makeTrendUiState = (
  oldState?: GenreUiState
): [TrendUiState, boolean] => {
  const oldParents = getParents(oldState)
  const oldInfluencedBy = getInfluencedBy(oldState)

  const parentTrends = oldParents.filter(isSimpleTrendOutput)
  const parentStyles = oldParents.filter(isSimpleStyleOutput)
  const parentMetas = oldParents.filter(isSimpleMetaOutput)
  const influencedByTrends = oldInfluencedBy.filter(isSimpleTrendOutput)
  const influencedByStyles = oldInfluencedBy.filter(isSimpleStyleOutput)

  const lostData =
    influencedByTrends.length + influencedByStyles.length !==
      oldInfluencedBy.length ||
    parentTrends.length + parentStyles.length + parentMetas.length !==
      oldParents.length

  return [
    {
      type: 'trend',
      name: oldState?.name ?? '',
      alternateNames: oldState?.alternateNames ?? '',
      shortDesc: oldState?.shortDesc ?? '',
      longDesc: oldState?.longDesc ?? '',
      parentTrends,
      parentStyles,
      parentMetas,
      influencedByTrends,
      influencedByStyles,
      locations: getLocations(oldState),
      cultures: getCultures(oldState),
    },
    lostData,
  ]
}
