import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import Loader from '../../../common/components/Loader'
import { GenreApiOutput } from '../../../common/model'
import {
  useCorrectGenreMutation,
  useDeleteCorrectionTimidMutation,
} from '../../../common/services/corrections'
import { GenreApiInput } from '../../../common/services/genres'
import { useCorrectionContext } from '../contexts/CorrectionContext'
import useIsMyCorrectionQuery from '../hooks/useIsMyCorrectionQuery'
import fetchCorrectionGenre from '../services'
import GenreForm from './forms/GenreForm'

const EditView: FC<{
  genreId: number
  from?: string
  deleteOnCancel?: boolean
}> = ({ genreId, from, deleteOnCancel }) => {
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
    return (
      <Loaded
        genreId={genreId}
        data={data}
        from={from}
        deleteOnCancel={deleteOnCancel}
      />
    )
  }

  return <Loader size={32} className='text-stone-600' />
}

const Loaded: FC<{
  genreId: number
  data: GenreApiInput
  from?: string
  deleteOnCancel?: boolean
}> = ({ genreId, data, from, deleteOnCancel }) => {
  const { id: correctionId } = useCorrectionContext()
  const [uiState, setUiState] = useState<GenreApiInput>(data)

  const { push: navigate } = useRouter()

  const { mutate: editGenre, isLoading } = useCorrectGenreMutation()
  const handleEditGenre = useCallback(
    () =>
      editGenre(
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
    [correctionId, genreId, editGenre, navigate, uiState]
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
      selfId={genreId}
      onSubmit={() => handleEditGenre()}
      onCancel={() => handleCancel()}
      isSubmitting={isLoading}
    />
  )
}

export default EditView
