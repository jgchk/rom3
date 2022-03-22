import { useMemo } from 'react'

import { GenreApiOutput } from '../../../common/model'
import useCorrectionGenresQuery from './useCorrectionGenresQuery'

export type GenreTree = {
  genres: Record<number, GenreApiOutput>
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

    for (const id of Object.keys(model.children)) {
      model.children[Number.parseInt(id)] = [
        ...new Set(model.children[Number.parseInt(id)]),
      ]
    }

    return model
  }, [genresQuery.data])

  return { ...genresQuery, data: tree }
}

export default useCorrectionGenreTreeQuery
