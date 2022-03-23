import { useMemo } from 'react'

import { GenreApiOutput } from '../../../common/model'
import { useCorrectionQuery } from '../../../common/services/corrections'
import { useGenresQuery } from '../../../common/services/genres'
import { TError } from '../../../common/utils/trpc'

const useCorrectionGenresQuery = (
  correctionId: number
): {
  data?: GenreApiOutput[]
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
        .map((genre) => editedIds[genre.id] ?? genre)
        // remove deleted parents/influences & replace ids of parents/influences that have pending edits with the edited genre ids
        .map((genre) => ({
          ...genre,
          parents: genre.parents
            // remove deleted genres
            .filter((parentId) => !deletedIds.has(parentId))
            // replace ids of genres that have pending edits with the edited genre id
            .map((parentId) => editedIds[parentId]?.id ?? parentId),
          influencedBy: genre.influencedBy
            // remove deleted genres
            .filter((inf) => !deletedIds.has(inf.id))
            // replace ids of genres that have pending edits with the edited genre id
            .map((inf) => ({
              ...inf,
              id: editedIds[inf.id]?.id ?? inf.id,
            })),
        })),
      ...Object.values(correctionQuery.data.create),
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
