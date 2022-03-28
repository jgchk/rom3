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
}> = ({ type, parentId }) => {
  const { id: correctionId } = useCorrectionContext()

  const { data: isMyCorrection } = useIsMyCorrectionQuery(correctionId)
  const { push: navigate } = useRouter()
  useEffect(() => {
    if (isMyCorrection === undefined) return
    if (!isMyCorrection) {
      void navigate(`/corrections/${correctionId}/edit/tree`)
    }
  }, [correctionId, isMyCorrection, navigate])

  const [uiState, setUiState] = useState<GenreApiInput>(
    makeUiData(type ?? 'META', parentId)
  )

  const { mutate } = useAddCreatedGenreMutation()
  const router = useRouter()
  const handleCreate = useCallback(
    () =>
      mutate(
        { id: correctionId, data: uiState },
        {
          onSuccess: () => {
            void router.push(`/corrections/${correctionId}/edit/tree`)
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [correctionId, mutate, router, uiState]
  )

  const handleCancel = useCallback(
    () => void router.push(`/corrections/${correctionId}/edit/tree`),
    [correctionId, router]
  )

  return (
    <GenreForm
      data={uiState}
      onChange={setUiState}
      onSubmit={() => handleCreate()}
      onCancel={() => handleCancel()}
    />
  )
}

export default CreateView
