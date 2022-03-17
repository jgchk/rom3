import { SimpleMetaOutput } from './metas'
import { SimpleStyleOutput } from './styles'
import { SimpleTrendOutput } from './trends'

export type ParentUiStateMap = {
  meta: SimpleMetaOutput
  style: SimpleStyleOutput
  trend: SimpleTrendOutput
}

export type ParentUiState = ParentUiStateMap[keyof ParentUiStateMap]
