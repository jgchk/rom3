import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import Loader from '../../../common/components/Loader'
import { GenreApiOutput } from '../../../common/model'
import { useCorrectGenreMutation } from '../../../common/services/corrections'
import { GenreApiInput } from '../../../common/services/genres'
import { useCorrectionContext } from '../contexts/CorrectionContext'
import useIsMyCorrectionQuery from '../hooks/useIsMyCorrectionQuery'
import fetchCorrectionGenre from '../services'
import GenreForm from './forms/GenreForm'

const EditView: FC<{ genreId: number; from?: string }> = ({
  genreId,
  from,
}) => {
  const { id: correctionId } = useCorrectionContext()

  const { data: isMyCorrection } = useIsMyCorrectionQuery(correctionId)
  const { push: navigate } = useRouter()
  useEffect(() => {
    if (isMyCorrection === undefined) return
    if (!isMyCorrection) {
      void navigate(`/corrections/${correctionId}/genres/${genreId}`)
    }
  }, [correctionId, genreId, isMyCorrection, navigate])

  const [data, setData] = useState<GenreApiOutput>()
  const fetchData = useCallback(async () => {
    const data = await fetchCorrectionGenre(genreId, correctionId)
    setData(data)
  }, [correctionId, genreId])
  useEffect(() => void fetchData(), [fetchData])

  if (data) {
    return <Loaded genreId={genreId} data={data} from={from} />
  }

  return <Loader size={32} className='text-stone-600' />
}

const Loaded: FC<{
  genreId: number
  data: GenreApiInput
  from?: string
}> = ({ genreId, data, from }) => {
  const { id: correctionId } = useCorrectionContext()
  const [uiState, setUiState] = useState<GenreApiInput>(data)

  const { push: navigate } = useRouter()

  const { mutate, isLoading } = useCorrectGenreMutation()
  const handleEdit = useCallback(
    () =>
      mutate(
        { id: correctionId, genreId, data: uiState },
        {
          onSuccess: () => {
            void navigate(`/corrections/${correctionId}/genres/${genreId}`)
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [correctionId, genreId, mutate, navigate, uiState]
  )

  const handleCancel = useCallback(
    () => void navigate(from ?? `/corrections/${correctionId}`),
    [correctionId, from, navigate]
  )

  return (
    <GenreForm
      data={uiState}
      onChange={setUiState}
      selfId={genreId}
      onSubmit={() => handleEdit()}
      onCancel={() => handleCancel()}
      isSubmitting={isLoading}
    />
  )
}

export default EditView
