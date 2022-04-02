import { useMemo } from 'react'

import { useCorrectionQuery } from '../../../common/services/corrections'
import { useGenreQuery } from '../../../common/services/genres'
import { TError } from '../../../common/utils/trpc'
import { CorrectionGenre, makeCorrectionGenre } from '../utils/genre'

const useCorrectionGenreQuery = (
  genreId: number,
  correctionId: number
): {
  data?: CorrectionGenre
  error: TError | null
  isLoading: boolean
} => {
  const genreQuery = useGenreQuery(genreId)
  const correctionQuery = useCorrectionQuery(correctionId)

  const genre = useMemo(() => {
    if (!correctionQuery.data) return
    if (!genreQuery.data) return
    return makeCorrectionGenre(genreQuery.data, correctionQuery.data)
  }, [correctionQuery.data, genreQuery.data])

  if (genre) {
    return { data: genre, error: null, isLoading: false }
  } else if (genreQuery.error || genreQuery.isLoading) {
    return { ...genreQuery, data: undefined }
  } else {
    return { ...correctionQuery, data: undefined }
  }
}

export default useCorrectionGenreQuery
