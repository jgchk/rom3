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
            toast.success(`Edited ${uiState.name} in correction`)
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
    <form
      className='space-y-2'
      onSubmit={(e) => {
        e.preventDefault()
        handleEdit()
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

export default EditView
