import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { GenreApiOutput } from '../../../common/model'
import { useCorrectGenreMutation } from '../../../common/services/corrections'
import { GenreApiInput } from '../../../common/services/genres'
import { useCorrectionContext } from '../contexts/CorrectionContext'
import fetchCorrectionGenre from '../services'
import GenreForm from './forms/GenreForm'

const EditView: FC<{ genreId: number }> = ({ genreId }) => {
  const { id: correctionId } = useCorrectionContext()

  const [data, setData] = useState<GenreApiOutput>()
  const fetchData = useCallback(async () => {
    const data = await fetchCorrectionGenre(genreId, correctionId)
    setData(data)
  }, [correctionId, genreId])
  useEffect(() => void fetchData(), [fetchData])

  if (data) {
    return <Loaded genreId={genreId} data={data} />
  }

  return <div>Loading...</div>
}

const Loaded: FC<{
  genreId: number
  data: GenreApiInput
}> = ({ genreId, data }) => {
  const { id: correctionId } = useCorrectionContext()
  const [uiState, setUiState] = useState<GenreApiInput>(data)

  const { mutate } = useCorrectGenreMutation()
  const router = useRouter()
  const handleEdit = useCallback(
    () =>
      mutate(
        { id: correctionId, genreId, data: uiState },
        {
          onSuccess: () => {
            void router.push(`/corrections/${correctionId}/edit/tree`)
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [correctionId, genreId, mutate, router, uiState]
  )

  const handleCancel = useCallback(
    () => void router.push(`/corrections/${correctionId}/edit/tree`),
    [correctionId, router]
  )

  return (
    <GenreForm
      data={uiState}
      onChange={setUiState}
      selfId={genreId}
      onSubmit={() => handleEdit()}
      onCancel={() => handleCancel()}
    />
  )
}

export default EditView
