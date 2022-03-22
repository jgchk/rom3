import { useMemo } from 'react'

import { GenreApiOutput } from '../../../common/model'
import { useCorrectionQuery } from '../../../common/services/corrections'
import { useGenreQuery } from '../../../common/services/genres'
import { TError } from '../../../common/utils/trpc'

const useCorrectionGenreQuery = (
  genreId: number,
  correctionId: number
): {
  data?: GenreApiOutput
  error: TError | null
  isLoading: boolean
} => {
  const genreQuery = useGenreQuery(genreId)
  const correctionQuery = useCorrectionQuery(correctionId)

  const genre = useMemo(() => {
    if (!correctionQuery.data) return

    const editedGenre = correctionQuery.data.edit.find(
      ({ targetGenre }) => targetGenre.id === genreId
    )?.updatedGenre

    return editedGenre ?? genreQuery.data
  }, [correctionQuery.data, genreId, genreQuery.data])

  if (genre) {
    return { data: genre, error: null, isLoading: false }
  } else if (genreQuery.error || genreQuery.isLoading) {
    return { ...genreQuery, data: undefined }
  } else {
    return { ...correctionQuery, data: undefined }
  }
}

export default useCorrectionGenreQuery
