import { useMemo } from 'react'

import trpc from '../../../common/utils/trpc'
import { CorrectionGenreApiInputData, CorrectionIdApiInput } from '../services'
import useCorrectionStore from '../state/store'
import { toCorrectionGenreApiInputData } from '../utils/convert'

export type GenreData = {
  id: CorrectionIdApiInput
  data: CorrectionGenreApiInputData
}

const useGenres = () => {
  const genresQuery = trpc.useQuery(['genres.all'], { useErrorBoundary: true })

  const createCorrections = useCorrectionStore((state) => state.create)
  const editCorrections = useCorrectionStore((state) => state.edit)
  const deleteCorrections = useCorrectionStore((state) => state.delete)

  const modifiedData: GenreData[] | undefined = useMemo(() => {
    if (!genresQuery.data) return

    const existingGenres: GenreData[] = [
      ...genresQuery.data
        // remove deleted genres
        .filter((genre) => !deleteCorrections.has(genre.id))
        // update edited genres
        .map((genre) => {
          const correctionId: CorrectionIdApiInput = {
            id: genre.id,
            type: 'exists',
          }

          const data: CorrectionGenreApiInputData =
            editCorrections.get(genre.id) ??
            toCorrectionGenreApiInputData(genre)

          return {
            id: correctionId,
            data,
          }
        }),
      // add created genres
      ...[...createCorrections.entries()].map(
        ([id, genre]): GenreData => ({
          id: { id, type: 'created' },
          data: genre,
        })
      ),
    ]

    return existingGenres
  }, [createCorrections, deleteCorrections, editCorrections, genresQuery.data])

  return { ...genresQuery, data: modifiedData }
}

export default useGenres
