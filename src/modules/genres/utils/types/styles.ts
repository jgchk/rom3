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
} from '.'
import { InfluenceUiState } from './influence'
import { isMetaParent, SimpleMetaOutput } from './metas'
import { ParentUiState } from './parents'

export type StyleInput = InferMutationInput<'styles.add'>
export type StyleOutput = InferQueryOutput<'styles.byId'>
export type SimpleStyleOutput = StyleOutput['parentStyles'][number] & {
  type: 'style'
}

export const isStyleOutput = (o: GenreOutput): o is StyleOutput =>
  o.type === 'style'
export const isStyleParent = (o: ParentUiState): o is SimpleStyleOutput =>
  o.type === 'style'
export const isStyleInfluence = (
  o: InfluenceUiState
): o is StyleInfluenceUiState => 'style' in o

export type InfluenceTypeOutput =
  StyleOutput['influencedByStyles'][number]['influenceType']
export type StyleInfluenceUiState = {
  style: SimpleStyleOutput
  influenceType: InfluenceTypeOutput
}

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
  influencedByStyles: StyleInfluenceUiState[]
  cultures: string
}

export const makeStyleUiState = (
  oldState?: GenreUiState
): [StyleUiState, boolean] => {
  const oldParents = getParents(oldState)
  const oldInfluencedBy = getInfluencedBy(oldState)

  const parentStyles = oldParents.filter(isStyleParent)
  const parentMetas = oldParents.filter(isMetaParent)
  const influencedByStyles = oldInfluencedBy.filter(isStyleInfluence)

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
