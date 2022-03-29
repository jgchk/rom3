import { useMemo } from 'react'

import { CorrectionGenre } from './useCorrectionGenreQuery'
import useCorrectionGenresQuery from './useCorrectionGenresQuery'

export type GenreTree = {
  genres: Record<number, CorrectionGenre>
  children: Record<number, number[]>
}

const useCorrectionGenreTreeQuery = (correctionId: number) => {
  const genresQuery = useCorrectionGenresQuery(correctionId)

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

export default useCorrectionGenreTreeQuery
