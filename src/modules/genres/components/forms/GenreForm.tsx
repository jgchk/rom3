import { Dispatch, ReactElement, SetStateAction } from 'react'

import { GenreUiState } from '../../utils/types'
import { GenreMultiselectProps } from '../GenreMultiselect'
import MetaForm from './MetaForm'
import SceneForm from './SceneForm'
import StyleForm from './StyleForm'
import TrendForm from './TrendForm'

export type GenreFormProps = {
  self?: GenreMultiselectProps['self']
  data: GenreUiState
  onChange: Dispatch<SetStateAction<GenreUiState>>
}

const GenreForm = ({
  self,
  data,
  onChange,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
GenreFormProps): ReactElement<any, any> | null => {
  switch (data.type) {
    case 'meta':
      return (
        <MetaForm
          self={self}
          data={data}
          onChange={(val) => onChange(val as SetStateAction<GenreUiState>)}
        />
      )
    case 'scene':
      return (
        <SceneForm
          self={self}
          data={data}
          onChange={(val) => onChange(val as SetStateAction<GenreUiState>)}
        />
      )
    case 'style':
      return (
        <StyleForm
          self={self}
          data={data}
          onChange={(val) => onChange(val as SetStateAction<GenreUiState>)}
        />
      )
    case 'trend':
      return (
        <TrendForm
          self={self}
          data={data}
          onChange={(val) => onChange(val as SetStateAction<GenreUiState>)}
        />
      )
  }
}

export default GenreForm
