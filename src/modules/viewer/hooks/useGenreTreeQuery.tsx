import { useMemo } from 'react'

import { GenreApiOutput } from '../../../common/model'
import { useGenresQuery } from '../../../common/services/genres'

export type GenreTree = {
  genres: Record<number, GenreApiOutput>
  children: Record<number, number[]>
}

const useGenreTreeQuery = () => {
  const genresQuery = useGenresQuery()

  const tree = useMemo(() => {
    if (!genresQuery.data) return

    const model: GenreTree = {
      genres: {},
      children: {},
    }

    for (const genre of genresQuery.data) {
      model.genres[genre.id] = genre

      for (const parentId of genre.parents) {
        model.children[parentId] = [
          ...(model.children[parentId] ?? []),
          genre.id,
        ]
      }
    }

    return model
  }, [genresQuery.data])

  return { ...genresQuery, data: tree }
}

export default useGenreTreeQuery