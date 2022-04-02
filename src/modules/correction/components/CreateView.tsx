import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { GenreType } from '../../../common/model'
import { useAddCreatedGenreMutation } from '../../../common/services/corrections'
import { GenreApiInput } from '../../../common/services/genres'
import { useCorrectionContext } from '../contexts/CorrectionContext'
import useIsMyCorrectionQuery from '../hooks/useIsMyCorrectionQuery'
import { makeUiData } from '../utils/genre'
import GenreForm from './forms/GenreForm'

const CreateView: FC<{
  type?: GenreType
  parentId?: number
  from?: string
}> = ({ type, parentId, from }) => {
  const { id: correctionId } = useCorrectionContext()

  const { data: isMyCorrection } = useIsMyCorrectionQuery(correctionId)
  const { push: navigate } = useRouter()
  useEffect(() => {
    if (isMyCorrection === undefined) return
    if (!isMyCorrection) {
      void navigate(`/corrections/${correctionId}`)
    }
  }, [correctionId, isMyCorrection, navigate])

  const [uiState, setUiState] = useState<GenreApiInput>(
    makeUiData(type ?? 'META', parentId)
  )

  const { mutate, isLoading } = useAddCreatedGenreMutation()
  const handleCreate = useCallback(
    () =>
      mutate(
        { id: correctionId, data: uiState },
        {
          onSuccess: (res) => {
            void navigate(`/corrections/${correctionId}/genres/${res.genreId}`)
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [correctionId, mutate, navigate, uiState]
  )

  const handleCancel = useCallback(
    () => void navigate(from ?? `/corrections/${correctionId}`),
    [correctionId, from, navigate]
  )

  return (
    <GenreForm
      data={uiState}
      onChange={setUiState}
      onSubmit={() => handleCreate()}
      onCancel={() => handleCancel()}
      isSubmitting={isLoading}
    />
  )
}

export default CreateView
