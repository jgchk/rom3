import { useRouter } from 'next/router'
import { FC, useCallback, useState } from 'react'

import useCorrectionGenreQuery from '../hooks/useCorrectionGenreQuery'
import { CorrectionGenreApiInputData, CorrectionIdApiInput } from '../services'
import useCorrectionStore from '../state/store'
import { cleanUiData } from '../utils/convert'
import FormElement from './forms/elements/FormElement'
import GenreTypeSelect from './forms/elements/GenreTypeSelect'
import GenreForm from './forms/GenreForm'

const EditView: FC<{ id: CorrectionIdApiInput }> = ({ id }) => {
  const { data } = useCorrectionGenreQuery(id)

  if (data) {
    return <Loaded id={id} data={data} />
  }

  return <div>Loading...</div>
}

const Loaded: FC<{
  id: CorrectionIdApiInput
  data: CorrectionGenreApiInputData
}> = ({ id, data }) => {
  const [uiState, setUiState] = useState<CorrectionGenreApiInputData>(data)

  const editCreatedGenre = useCorrectionStore((state) => state.editCreatedGenre)
  const editExistingGenre = useCorrectionStore(
    (state) => state.editExistingGenre
  )
  const router = useRouter()
  const handleEdit = useCallback(() => {
    if (id.type === 'created') {
      editCreatedGenre(id.id, cleanUiData(uiState))
    } else {
      editExistingGenre(id.id, cleanUiData(uiState))
    }
    void router.push('/corrections/edit/tree')
  }, [editCreatedGenre, editExistingGenre, id.id, id.type, router, uiState])

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
