import { useMemo } from 'react'

import trpc from '../../../common/utils/trpc'
import { CorrectionGenreApiInputData, CorrectionIdApiInput } from '../services'
import useCorrectionStore from '../state/store'
import { toCorrectionGenreApiInputData } from '../utils/convert'

export type GenreData = {
  id: CorrectionIdApiInput
  data: CorrectionGenreApiInputData
}

const useGenresQuery = () => {
  // TODO: extract to its own service hook
  const genresQuery = trpc.useQuery(['genres.all'], { useErrorBoundary: true })

  const createCorrections = useCorrectionStore((state) => state.create)
  const editCorrections = useCorrectionStore((state) => state.edit)
  const deleteCorrections = useCorrectionStore((state) => state.delete)

  const modifiedData: GenreData[] | undefined = useMemo(() => {
    if (!genresQuery.data) return

    const genres: GenreData[] = [
      ...genresQuery.data
        // remove deleted genres
        .filter((genre) => !deleteCorrections.includes(genre.id))
        // update edited genres
        .map((genre) => {
          const correctionId: CorrectionIdApiInput = {
            id: genre.id,
            type: 'exists',
          }

          const data: CorrectionGenreApiInputData =
            editCorrections[genre.id] ?? toCorrectionGenreApiInputData(genre)

          return {
            id: correctionId,
            data,
          }
        }),
      // add created genres
      ...Object.entries(createCorrections).map(
        ([id, genre]): GenreData => ({
          id: { id: Number.parseInt(id), type: 'created' },
          data: genre,
        })
      ),
    ]

    return genres
  }, [createCorrections, deleteCorrections, editCorrections, genresQuery.data])

  return { ...genresQuery, data: modifiedData }
}

export default useGenresQuery
