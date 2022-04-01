import { GenreApiOutput } from '../../../common/model'
import { trpcClient } from '../../../common/utils/trpc'
import { makeCorrectionGenre } from '../utils/genre'

const fetchCorrectionGenre = async (
  genreId: number,
  correctionId: number
): Promise<GenreApiOutput> => {
  const genre = await trpcClient.query('genres.byId', { id: genreId })
  const correction = await trpcClient.query('corrections.byId', {
    id: correctionId,
  })

  return makeCorrectionGenre(genre, correction)
}

export default fetchCorrectionGenre
