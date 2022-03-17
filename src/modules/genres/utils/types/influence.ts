import { SimpleSceneOutput } from './scenes'
import { StyleInfluenceUiState } from './styles'
import { SimpleTrendOutput } from './trends'

export type InfluenceUiStateMap = {
  scene: SimpleSceneOutput
  style: StyleInfluenceUiState
  trend: SimpleTrendOutput
}

export type InfluenceUiState = InfluenceUiStateMap[keyof InfluenceUiStateMap]
