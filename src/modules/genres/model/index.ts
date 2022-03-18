import { InferQueryOutput } from '../../../common/utils/trpc'
import { InfluenceUiState } from './influence'
import { LocationUiState } from './location'
import { makeMetaUiState, MetaUiState } from './metas'
import { ParentUiState } from './parents'
import { makeSceneUiState, SceneUiState } from './scenes'
import { makeStyleUiState, StyleUiState } from './styles'
import { makeTrendUiState, TrendUiState } from './trends'

export type GenreName = InferQueryOutput<'genres'>[number]['type']
export const genreNames: GenreName[] = ['meta', 'scene', 'style', 'trend']
export const isGenreName = (s: string): s is GenreName =>
  genreNames.includes(s as never)

export type GenreOutput = InferQueryOutput<'genres'>[number]

export const getGenreKey = ({ type, id }: { type: string; id: number }) =>
  `${type}_${id}`

export type GenreUiState =
  | MetaUiState
  | SceneUiState
  | StyleUiState
  | TrendUiState

export const getInfluencedBy = (oldData?: GenreUiState): InfluenceUiState[] => {
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

export const getParents = (oldData?: GenreUiState): ParentUiState[] => {
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

export const getLocations = (oldData?: GenreUiState): LocationUiState[] => {
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

export const getCultures = (oldData?: GenreUiState): string => {
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

export const makeUiState = (
  targetType: GenreName,
  oldState?: GenreUiState
): [GenreUiState, boolean] => {
  switch (targetType) {
    case 'meta':
      return makeMetaUiState(oldState)
    case 'scene':
      return makeSceneUiState(oldState)
    case 'style':
      return makeStyleUiState(oldState)
    case 'trend':
      return makeTrendUiState(oldState)
  }
}
