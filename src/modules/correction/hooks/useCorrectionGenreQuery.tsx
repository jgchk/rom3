import { useMemo } from 'react'

import { GenreApiOutput } from '../../../common/model'
import { useCorrectionQuery } from '../../../common/services/corrections'
import { useGenreQuery } from '../../../common/services/genres'
import { TError } from '../../../common/utils/trpc'

export type CorrectionGenre = GenreApiOutput & {
  changes: 'created' | 'edited' | undefined
}

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

    const deletedIds = new Set(
      correctionQuery.data.delete.map((genre) => genre.id)
    )
    const editedIds: Record<number, GenreApiOutput | undefined> =
      Object.fromEntries(
        correctionQuery.data.edit.map(({ targetGenre, updatedGenre }) => [
          targetGenre.id,
          updatedGenre,
        ])
      )

    if (deletedIds.has(genreId)) {
      throw new Error(`No account with id '${genreId}'`)
    }

    const editedGenre = editedIds[genreId]

    const genre: CorrectionGenre = editedGenre
      ? { ...editedGenre, id: genreId, changes: 'edited' }
      : { ...genreQuery.data, changes: undefined }

    return {
      ...genre,
      parents: genre.parents
        // remove deleted genres
        .filter((parentId) => !deletedIds.has(parentId)),
      children: genre.children
        // remove deleted genres
        .filter((childId) => !deletedIds.has(childId)),
      influencedBy: genre.influencedBy
        // remove deleted genres
        .filter((inf) => !deletedIds.has(inf.id)),
    }
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
