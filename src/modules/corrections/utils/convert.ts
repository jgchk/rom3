import { InferMutationInput } from '../../../common/utils/trpc'
import { GenreName, GenreUiState } from '../../genres/model'
import { toAddApi } from '../../genres/utils/convert'

export const toAddCorrectionApi = (
  data: GenreUiState
): InferMutationInput<'corrections.add'> => [
  { action: 'create', data: toAddApi(data) },
]

export const toEditCorrectionApi = (
  targetId: number,
  data: GenreUiState
): InferMutationInput<'corrections.add'> => [
  { action: 'edit', targetId, data: toAddApi(data) },
]

export const toDeleteCorrectionApi = (
  type: GenreName,
  id: number
): InferMutationInput<'corrections.add'> => [{ action: 'delete', type, id }]
