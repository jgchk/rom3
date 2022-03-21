import { useMemo } from 'react'

import { GenreApiOutput } from '../../../common/model'
import trpc from '../../../common/utils/trpc'

const useGenresQuery = (correctionId: number) => {
  // TODO: extract to its own service hook
  const genresQuery = trpc.useQuery(['genres.all'], { useErrorBoundary: true })

  // TODO: extract to its own service hook
  const correctionQuery = trpc.useQuery(
    ['corrections.byId', { id: correctionId }],
    { useErrorBoundary: true }
  )

  const modifiedData = useMemo(() => {
    if (!genresQuery.data) return
    if (!correctionQuery.data) return

    const deletedIds = new Set(
      correctionQuery.data.delete.map((genre) => genre.id)
    )
    const editedIds: Record<number, GenreApiOutput> = Object.fromEntries(
      correctionQuery.data.edit.map(({ targetGenre, updatedGenre }) => [
        targetGenre.id,
        updatedGenre,
      ])
    )

    const genres = [
      ...genresQuery.data
        .filter((genre) => !deletedIds.has(genre.id))
        .map((genre) => editedIds[genre.id] ?? genre),
      ...Object.values(correctionQuery.data.create),
    ]

    return genres
  }, [correctionQuery.data, genresQuery.data])

  return { ...genresQuery, data: modifiedData }
}

export default useGenresQuery
