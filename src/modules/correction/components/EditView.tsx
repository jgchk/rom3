import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { GenreApiOutput } from '../../../common/model'
import { useCorrectGenreMutation } from '../../../common/services/corrections'
import { GenreApiInput } from '../../../common/services/genres'
import { useCorrectionContext } from '../contexts/CorrectionContext'
import fetchCorrectionGenre from '../services'
import { cleanUiData } from '../utils/genre'
import FormElement from './forms/elements/FormElement'
import GenreTypeSelect from './forms/elements/GenreTypeSelect'
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
        { id: correctionId, genreId, data: cleanUiData(uiState) },
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleEdit()
      }}
    >
      <FormElement>
        <label>Type</label>
        <GenreTypeSelect
          value={uiState.type}
          onChange={(type) => {
            // TODO: limit parent/influence types & location/culture fields. run conversion
            //
            // const [newData, dataLost] = makeUiState(val, uiState)
            // const shouldRun = dataLost
            //   ? confirm(
            //       'Some data may be lost in the conversion. Are you sure you want to continue?'
            //     )
            //   : true
            // if (shouldRun) setUiState(newData)

            setUiState((s) => ({ ...s, type }))
          }}
        />
      </FormElement>
      <GenreForm data={uiState} onChange={setUiState} />
      <button type='submit'>Submit</button>
    </form>
  )
}

export default EditView
