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

export type SceneInput = InferMutationInput<'scenes.add'>
export type SceneOutput = InferQueryOutput<'scenes.byId'>
export type SimpleSceneOutput = SceneOutput['influencedByScenes'][number] & {
  type: 'scene'
}

export const isSceneOutput = (o: GenreOutput): o is SceneOutput =>
  o.type === 'scene'
export const isSceneInfluence = (o: InfluenceUiState): o is SimpleSceneOutput =>
  o.type === 'scene'

export type SceneUiState = Omit<
  InferMutationInput<'scenes.add'>,
  'alternateNames' | 'influencedByScenes' | 'cultures'
> & {
  type: 'scene'
  alternateNames: string
  influencedByScenes: SimpleSceneOutput[]
  cultures: string
}

export const makeSceneUiState = (
  oldState?: GenreUiState
): [SceneUiState, boolean] => {
  const oldParents = getParents(oldState)
  const oldInfluencedBy = getInfluencedBy(oldState)

  const influencedByScenes = oldInfluencedBy.filter(isSceneInfluence)

  const lostData =
    influencedByScenes.length !== oldInfluencedBy.length ||
    oldParents.length > 0

  return [
    {
      type: 'scene',
      name: oldState?.name ?? '',
      alternateNames: oldState?.alternateNames ?? '',
      shortDesc: oldState?.shortDesc ?? '',
      longDesc: oldState?.longDesc ?? '',
      influencedByScenes,
      locations: getLocations(oldState),
      cultures: getCultures(oldState),
    },
    lostData,
  ]
}
