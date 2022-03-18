import { Dispatch, ReactElement, SetStateAction } from 'react'

import { GenreUiState } from '../../model'
import MetaForm from './MetaForm'
import SceneForm from './SceneForm'
import StyleForm from './StyleForm'
import TrendForm from './TrendForm'

export type GenreFormProps = {
  data: GenreUiState
  onChange: Dispatch<SetStateAction<GenreUiState>>
}

const GenreForm = ({
  data,
  onChange,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
GenreFormProps): ReactElement<any, any> | null => {
  switch (data.type) {
    case 'meta':
      return (
        <MetaForm
          data={data}
          onChange={(val) => onChange(val as SetStateAction<GenreUiState>)}
        />
      )
    case 'scene':
      return (
        <SceneForm
          data={data}
          onChange={(val) => onChange(val as SetStateAction<GenreUiState>)}
        />
      )
    case 'style':
      return (
        <StyleForm
          data={data}
          onChange={(val) => onChange(val as SetStateAction<GenreUiState>)}
        />
      )
    case 'trend':
      return (
        <TrendForm
          data={data}
          onChange={(val) => onChange(val as SetStateAction<GenreUiState>)}
        />
      )
  }
}

export default GenreForm
