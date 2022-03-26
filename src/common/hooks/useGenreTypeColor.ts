import { useMemo } from 'react'

import { GenreType } from '../model'

const colors: Record<GenreType, string> = {
  META: 'text-orange-600',
  SCENE: 'text-teal-600',
  STYLE: 'text-blue-600',
  TREND: 'text-fuchsia-600',
}

const useGenreTypeColor = (genreType: GenreType) =>
  useMemo(() => colors[genreType], [genreType])

export default useGenreTypeColor
