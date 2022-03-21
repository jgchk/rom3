import { useRouter } from 'next/router'
import { FC, useCallback, useState } from 'react'

import { GenreType } from '../../../common/model'
import {
  CorrectionGenreApiInputData,
  CorrectionIdApiInput,
  makeCorrectionGenreApiInputData,
} from '../services'
import useCorrectionStore from '../state/store'
import FormElement from './forms/elements/FormElement'
import GenreTypeSelect from './forms/elements/GenreTypeSelect'
import GenreForm from './forms/GenreForm'

const CreateView: FC<{ type?: GenreType; parentId?: CorrectionIdApiInput }> = ({
  type,
  // TODO
  // parentId,
}) => {
  const [uiState, setUiState] = useState<CorrectionGenreApiInputData>(
    makeCorrectionGenreApiInputData(type ?? 'META')
  )

  const addCreatedGenre = useCorrectionStore((state) => state.addCreatedGenre)
  const router = useRouter()
  const handleCreate = useCallback(() => {
    addCreatedGenre(uiState)
    void router.push('/')
  }, [addCreatedGenre, router, uiState])

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
            // TODO
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
