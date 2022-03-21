import { useMemo } from 'react'

import { CorrectionGenreApiInputData, CorrectionIdApiInput } from '../services'
import useGenres from './useGenres'

export type GenreTree = {
  genres: Map<CorrectionIdApiInput, CorrectionGenreApiInputData>
  children: Map<CorrectionIdApiInput, CorrectionIdApiInput[]>
}

export const useGenreTreeQuery = () => {
  const genresQuery = useGenres()

  const tree = useMemo(() => {
    if (!genresQuery.data) return

    const model: GenreTree = {
      genres: new Map(),
      children: new Map(),
    }

    for (const { id, data } of genresQuery.data) {
      model.genres.set(id, data)

      for (const parentId of data.parents) {
        model.children.set(parentId, [
          ...(model.children.get(parentId) ?? []),
          id,
        ])
      }
    }

    return model
  }, [genresQuery.data])

  return { ...genresQuery, data: tree }
}
