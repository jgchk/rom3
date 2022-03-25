import { GenreApiOutput } from '../../../common/model'
import { trpcClient } from '../../../common/utils/trpc'

const fetchCorrectionGenre = async (
  genreId: number,
  correctionId: number
): Promise<GenreApiOutput> => {
  const correction = await trpcClient.query('corrections.byId', {
    id: correctionId,
  })

  const editedGenre = correction.edit.find(
    (e) => e.targetGenre.id === genreId
  )?.updatedGenre

  if (editedGenre) return editedGenre

  return trpcClient.query('genres.byId', { id: genreId })
}

export default fetchCorrectionGenre
