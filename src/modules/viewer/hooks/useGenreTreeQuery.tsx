import { useMemo } from 'react'

import { GenreApiOutput } from '../../../common/model'
import { useGenresQuery } from '../../../common/services/genres'

export type GenreTree = Record<number, GenreApiOutput>

const useGenreTreeQuery = () => {
  const genresQuery = useGenresQuery()

  const tree = useMemo(() => {
    if (!genresQuery.data) return

    const model: GenreTree = Object.fromEntries(
      genresQuery.data.map((genre) => [genre.id, genre])
    )

    return model
  }, [genresQuery.data])

  return { ...genresQuery, data: tree }
}

export default useGenreTreeQuery
