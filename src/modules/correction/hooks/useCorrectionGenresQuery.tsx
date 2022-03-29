import { useMemo } from 'react'

import { GenreApiOutput } from '../../../common/model'
import { useCorrectionQuery } from '../../../common/services/corrections'
import { useGenresQuery } from '../../../common/services/genres'
import { TError } from '../../../common/utils/trpc'
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

    const genres = [
      ...genresQuery.data
        // remove deleted genres
        .filter((genre) => !deletedIds.has(genre.id))
        // replace edited genres with their real genres
        .map((genre): CorrectionGenre => {
          const editedGenre = editedIds[genre.id]
          return editedGenre
            ? { ...editedGenre, id: genre.id, changes: 'edited' }
            : { ...genre, changes: undefined }
        })
        // remove deleted parents/influences
        .map((genre) => ({
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
        })),
      ...Object.values(correctionQuery.data.create).map(
        (genre): CorrectionGenre => ({
          ...genre,
          changes: 'created',
        })
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
