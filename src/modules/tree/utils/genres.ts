import { GenreOutput } from '../../genres/model'

export const getParents = (o: GenreOutput) => {
  switch (o.type) {
    case 'meta':
      return o.parentMetas
    case 'scene':
      return []
    case 'style':
      return [...o.parentStyles, ...o.parentMetas]
    case 'trend':
      return [...o.parentTrends, ...o.parentStyles, ...o.parentMetas]
  }
}
