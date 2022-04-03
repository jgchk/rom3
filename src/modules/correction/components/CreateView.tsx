import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { GenreType } from '../../../common/model'
import {
  useAddCreatedGenreMutation,
  useDeleteCorrectionTimidMutation,
} from '../../../common/services/corrections'
import { GenreApiInput } from '../../../common/services/genres'
import { useCorrectionContext } from '../contexts/CorrectionContext'
import useIsMyCorrectionQuery from '../hooks/useIsMyCorrectionQuery'
import { makeUiData } from '../utils/genre'
import GenreForm from './forms/GenreForm'

const CreateView: FC<{
  type?: GenreType
  parentId?: number
  from?: string
  deleteOnCancel?: boolean
}> = ({ type, parentId, from, deleteOnCancel }) => {
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

  const { mutate: addGenre, isLoading } = useAddCreatedGenreMutation()
  const handleCreateGenre = useCallback(
    () =>
      addGenre(
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
    [correctionId, addGenre, navigate, uiState]
  )

  const { mutate: deleteCorrection } = useDeleteCorrectionTimidMutation()
  const handleDeleteCorrection = useCallback(
    () =>
      deleteCorrection(
        { id: correctionId },
        {
          onSuccess: (res) => {
            if (res === false) {
              // Correction was not deleted
              void navigate(from ?? `/corrections/${correctionId}`)
            } else {
              // Correction was deleted
              void navigate(from ?? '/corrections')
            }
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [correctionId, deleteCorrection, from, navigate]
  )

  const handleCancel = useCallback(() => {
    if (deleteOnCancel) {
      handleDeleteCorrection()
    } else {
      void navigate(from ?? `/corrections/${correctionId}`)
    }
  }, [correctionId, deleteOnCancel, from, handleDeleteCorrection, navigate])

  return (
    <GenreForm
      data={uiState}
      onChange={setUiState}
      onSubmit={() => handleCreateGenre()}
      onCancel={() => handleCancel()}
      isSubmitting={isLoading}
    />
  )
}

export default CreateView
