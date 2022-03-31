import { useMemo } from 'react'

import { GenreApiOutput } from '../../../common/model'
import { useCorrectionQuery } from '../../../common/services/corrections'
import { useGenreQuery } from '../../../common/services/genres'
import { TError } from '../../../common/utils/trpc'
import { makeCorrectionGenre } from '../utils/genre'

export type CorrectionGenre = GenreApiOutput & {
  changes: ChangeType | undefined
}
export type ChangeType = 'created' | 'edited' | 'deleted'

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

    const genre = makeCorrectionGenre(genreQuery.data, correctionQuery.data)

    if (genre === undefined) {
      throw new Error(`No account with id '${genreId}'`)
    }

    return genre
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
