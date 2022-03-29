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

    let genre = editedIds[genreId] ?? genreQuery.data
    genre = {
      ...genre,
      parents: genre.parents
        // remove deleted genres
        .filter((parentId) => !deletedIds.has(parentId))
        // replace ids of genres that have pending edits with the edited genre id
        .map((parentId) => editedIds[parentId]?.id ?? parentId),
      children: genre.children
        // remove deleted genres
        .filter((childId) => !deletedIds.has(childId))
        // replace ids of genres that have pending edits with the edited genre id
        .map((childId) => editedIds[childId]?.id ?? childId),
      influencedBy: genre.influencedBy
        // remove deleted genres
        .filter((inf) => !deletedIds.has(inf.id))
        // replace ids of genres that have pending edits with the edited genre id
        .map((inf) => ({
          ...inf,
          id: editedIds[inf.id]?.id ?? inf.id,
        })),
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
