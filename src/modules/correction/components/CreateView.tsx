import { useRouter } from 'next/router'
import { FC, useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import { GenreType } from '../../../common/model'
import { useAddCreatedGenreMutation } from '../../../common/services/corrections'
import { GenreApiInput } from '../../../common/services/genres'
import { useCorrectionContext } from '../contexts/CorrectionContext'
import { cleanUiData, makeUiData } from '../utils/genre'
import FormElement from './forms/elements/FormElement'
import GenreTypeSelect from './forms/elements/GenreTypeSelect'
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
        { id: correctionId, data: cleanUiData(uiState) },
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleCreate()
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

export default CreateView
