import { Dispatch, FC, SetStateAction, useCallback } from 'react'

import { GenreApiInput } from '../../../server/routers/genres'
import GenreTypeSelect from './elements/GenreTypeSelect'
import MetaForm from './MetaForm'
import SceneForm from './SceneForm'
import StyleForm from './StyleForm'
import TrendForm from './TrendForm'

const GenreForm: FC<{
  data: GenreApiInput
  onChange: Dispatch<SetStateAction<GenreApiInput>>
}> = ({ data, onChange }) => {
  const renderForm = useCallback(() => {
    switch (data.type) {
      case 'META':
        return <MetaForm data={data} onChange={onChange} />
      case 'SCENE':
        return <SceneForm data={data} onChange={onChange} />
      case 'STYLE':
        return <StyleForm data={data} onChange={onChange} />
      case 'TREND':
        return <TrendForm data={data} onChange={onChange} />
    }
  }, [data, onChange])

  return (
    <>
      <div>
        <label className='block'>Type</label>
        <GenreTypeSelect
          value={data.type}
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

            onChange((d) => ({ ...d, type }))
          }}
        />
      </div>
      {renderForm()}
    </>
  )
}

export default GenreForm
