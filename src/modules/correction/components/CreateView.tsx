import { useRouter } from 'next/router'
import { FC, useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import { GenreType } from '../../../common/model'
import { useAddCreatedGenreMutation } from '../../../common/services/corrections'
import { GenreApiInput } from '../../../common/services/genres'
import { useCorrectionContext } from '../contexts/CorrectionContext'
import { makeUiData } from '../utils/genre'
import GenreForm from './forms/GenreForm'

const CreateView: FC<{
  type?: GenreType
  parentId?: number
}> = ({ type, parentId }) => {
  const { id: correctionId } = useCorrectionContext()
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
