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

export type MetaInput = InferMutationInput<'metas.add'>
export type MetaOutput = InferQueryOutput<'metas.byId'>
export type SimpleMetaOutput = MetaOutput['parentMetas'][number] & {
  type: 'meta'
}

export const isMetaOutput = (o: GenreOutput): o is MetaOutput =>
  o.type === 'meta'
export const isSimpleMetaOutput = (
  o: SimpleGenreOutput
): o is SimpleMetaOutput => o.type === 'meta'

export type MetaUiState = Omit<
  InferMutationInput<'metas.add'>,
  'alternateNames' | 'parentMetas'
> & { type: 'meta'; alternateNames: string; parentMetas: SimpleMetaOutput[] }

export const makeMetaUiState = (
  oldState?: GenreUiState
): [MetaUiState, boolean] => {
  const oldParents = getParents(oldState)
  const oldInfluencedBy = getInfluencedBy(oldState)
  const oldLocations = getLocations(oldState)
  const oldCultures = getCultures(oldState)

  const parentMetas = oldParents.filter(isSimpleMetaOutput)

  const lostData =
    parentMetas.length !== oldParents.length ||
    oldInfluencedBy.length > 0 ||
    oldLocations.length > 0 ||
    oldCultures.length > 0

  return [
    {
      type: 'meta',
      name: oldState?.name ?? '',
      alternateNames: oldState?.alternateNames ?? '',
      shortDesc: oldState?.shortDesc ?? '',
      longDesc: oldState?.longDesc ?? '',
      parentMetas,
    },
    lostData,
  ]
}
