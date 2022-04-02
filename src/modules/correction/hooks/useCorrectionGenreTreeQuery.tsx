import { useMemo } from 'react'

import { CorrectionGenre } from '../utils/genre'
import useCorrectionGenresQuery from './useCorrectionGenresQuery'

export type GenreTree = Record<number, CorrectionGenre>

const useCorrectionGenreTreeQuery = (correctionId: number) => {
  const genresQuery = useCorrectionGenresQuery(correctionId)

  const tree = useMemo(() => {
    if (!genresQuery.data) return

    const model: GenreTree = Object.fromEntries(
      genresQuery.data.map((genre) => [genre.id, genre])
    )

    return model
  }, [genresQuery.data])

  return { ...genresQuery, data: tree }
}

export default useCorrectionGenreTreeQuery
