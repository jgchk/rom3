import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

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
      void navigate({
        pathname: `/corrections/${correctionId}/genres/view`,
        query: { genreId },
      })
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

  return <div>Loading...</div>
}

const Loaded: FC<{
  genreId: number
  data: GenreApiInput
  from?: string
}> = ({ genreId, data, from }) => {
  const { id: correctionId } = useCorrectionContext()
  const [uiState, setUiState] = useState<GenreApiInput>(data)

  const { push: navigate } = useRouter()
  const navigateBack = useCallback(
    () => void navigate(from ?? `/corrections/${correctionId}`),
    [correctionId, from, navigate]
  )

  const { mutate } = useCorrectGenreMutation()
  const handleEdit = useCallback(
    () =>
      mutate(
        { id: correctionId, genreId, data: uiState },
        {
          onSuccess: () => {
            navigateBack()
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [correctionId, genreId, mutate, navigateBack, uiState]
  )

  const handleCancel = useCallback(() => navigateBack(), [navigateBack])

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
