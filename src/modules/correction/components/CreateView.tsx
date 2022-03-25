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
            toast.success(`Added ${uiState.name} to correction`)
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
    <form
      className='space-y-2'
      onSubmit={(e) => {
        e.preventDefault()
        handleCreate()
      }}
    >
      <GenreForm data={uiState} onChange={setUiState} />
      <div className='space-x-2'>
        <button
          className='bg-primary-600 text-white uppercase text-sm font-bold px-2 py-1 rounded-sm'
          type='submit'
        >
          Submit
        </button>
        <button
          className='text-gray-500 uppercase text-sm font-bold px-1 py-1'
          type='button'
          onClick={() => handleCancel()}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default CreateView
