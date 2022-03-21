import { useMemo } from 'react'

import trpc, { TError } from '../../../common/utils/trpc'
import { CorrectionGenreApiInputData, CorrectionIdApiInput } from '../services'
import useCorrectionStore from '../state/store'
import { toCorrectionGenreApiInputData } from '../utils/convert'

const useGenre = (
  id: CorrectionIdApiInput
): {
  data?: CorrectionGenreApiInputData
  error: TError | null
  isLoading: boolean
} => {
  const createdData = useCorrectionStore((state) =>
    id.type === 'created' ? state.create.get(id.id) : undefined
  )

  const editedData = useCorrectionStore((state) =>
    id.type === 'exists' ? state.edit.get(id.id) : undefined
  )

  const genreQuery = trpc.useQuery(['genres.byId', { id: id.id }], {
    enabled: id.type === 'exists' && !editedData,
    useErrorBoundary: true,
  })

  const genreQueryData = useMemo(
    () => genreQuery.data && toCorrectionGenreApiInputData(genreQuery.data),
    [genreQuery.data]
  )

  if (id.type === 'created') {
    return { data: editedData, error: null, isLoading: false }
  } else if (editedData) {
    return { data: createdData, error: null, isLoading: false }
  } else return { ...genreQuery, data: genreQueryData }
}

export default useGenre
