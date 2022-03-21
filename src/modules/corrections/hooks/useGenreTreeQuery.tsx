import { useMemo } from 'react'

import { CorrectionGenreApiInputData, CorrectionIdApiInput } from '../services'
import { toCorrectionIdApiInputKey } from '../utils/keys'
import useGenresQuery from './useGenresQuery'

export type GenreTree = {
  genres: Record<string, CorrectionGenreApiInputData>
  children: Record<string, CorrectionIdApiInput[]>
}

const useGenreTreeQuery = () => {
  const genresQuery = useGenresQuery()

  const tree = useMemo(() => {
    if (!genresQuery.data) return

    const model: GenreTree = {
      genres: {},
      children: {},
    }

    for (const { id, data } of genresQuery.data) {
      const key = toCorrectionIdApiInputKey(id)
      model.genres[key] = data

      for (const parentId of data.parents) {
        const parentKey = toCorrectionIdApiInputKey(parentId)
        model.children[parentKey] = [...(model.children[parentKey] ?? []), id]
      }
    }

    return model
  }, [genresQuery.data])

  return { ...genresQuery, data: tree }
}

export default useGenreTreeQuery
