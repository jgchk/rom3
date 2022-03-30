import { useMemo } from 'react'

import { useCorrectionQuery } from '../../../common/services/corrections'
import { useGenresQuery } from '../../../common/services/genres'
import { TError } from '../../../common/utils/trpc'
import { isDefined } from '../../../common/utils/types'
import { makeCorrectionGenre } from '../utils/genre'
import { CorrectionGenre } from './useCorrectionGenreQuery'

const useCorrectionGenresQuery = (
  correctionId: number
): {
  data?: CorrectionGenre[]
  error: TError | null
  isLoading: boolean
} => {
  const genresQuery = useGenresQuery()
  const correctionQuery = useCorrectionQuery(correctionId)

  const modifiedData = useMemo(() => {
    if (!genresQuery.data) return
    if (!correctionQuery.data) return

    const createdGenres = Object.values(correctionQuery.data.create)

    const genres = [
      ...genresQuery.data
        .map((genre) => makeCorrectionGenre(genre, correctionQuery.data))
        .filter(isDefined),

      ...createdGenres.map(
        (genre): CorrectionGenre => ({ ...genre, changes: 'created' })
      ),
    ]

    return genres
  }, [correctionQuery.data, genresQuery.data])

  if (modifiedData) {
    return { data: modifiedData, error: null, isLoading: false }
  } else if (genresQuery.error || genresQuery.isLoading) {
    return { ...genresQuery, data: undefined }
  } else {
    return { ...correctionQuery, data: undefined }
  }
}

export default useCorrectionGenresQuery
