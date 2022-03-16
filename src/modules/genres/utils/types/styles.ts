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

export type StyleInput = InferMutationInput<'styles.add'>
export type StyleOutput = InferQueryOutput<'styles.byId'>
export type SimpleStyleOutput = StyleOutput['parentStyles'][number] & {
  type: 'style'
}

export const isStyleOutput = (o: GenreOutput): o is StyleOutput =>
  o.type === 'style'
export const isSimpleStyleOutput = (
  o: SimpleGenreOutput
): o is SimpleStyleOutput => o.type === 'style'

export type StyleUiState = Omit<
  InferMutationInput<'styles.add'>,
  | 'alternateNames'
  | 'parentStyles'
  | 'parentMetas'
  | 'influencedByStyles'
  | 'cultures'
> & {
  type: 'style'
  alternateNames: string
  parentStyles: SimpleStyleOutput[]
  parentMetas: SimpleMetaOutput[]
  influencedByStyles: SimpleStyleOutput[]
  cultures: string
}

export const makeStyleUiState = (
  oldState?: GenreUiState
): [StyleUiState, boolean] => {
  const oldParents = getParents(oldState)
  const oldInfluencedBy = getInfluencedBy(oldState)

  const parentStyles = oldParents.filter(isSimpleStyleOutput)
  const parentMetas = oldParents.filter(isSimpleMetaOutput)
  const influencedByStyles = oldInfluencedBy.filter(isSimpleStyleOutput)

  const lostData =
    influencedByStyles.length !== oldInfluencedBy.length ||
    parentStyles.length + parentMetas.length !== oldParents.length

  return [
    {
      type: 'style',
      name: oldState?.name ?? '',
      alternateNames: oldState?.alternateNames ?? '',
      shortDesc: oldState?.shortDesc ?? '',
      longDesc: oldState?.longDesc ?? '',
      parentStyles,
      parentMetas,
      influencedByStyles,
      locations: getLocations(oldState),
      cultures: getCultures(oldState),
    },
    lostData,
  ]
}
