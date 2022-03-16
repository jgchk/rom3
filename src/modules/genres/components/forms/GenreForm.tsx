import { Dispatch, ReactElement, SetStateAction } from 'react'

import { GenreUiState } from '../../utils/types'
import MetaForm from './MetaForm'
import SceneForm from './SceneForm'
import StyleForm from './StyleForm'
import TrendForm from './TrendForm'

export type GenreFormProps = {
  selfId?: number
  data: GenreUiState
  onChange: Dispatch<SetStateAction<GenreUiState>>
}

const GenreForm = ({
  selfId,
  data,
  onChange,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
GenreFormProps): ReactElement<any, any> | null => {
  switch (data.type) {
    case 'meta':
      return (
        <MetaForm
          selfId={selfId}
          data={data}
          onChange={(val) => onChange(val as SetStateAction<GenreUiState>)}
        />
      )
    case 'scene':
      return (
        <SceneForm
          selfId={selfId}
          data={data}
          onChange={(val) => onChange(val as SetStateAction<GenreUiState>)}
        />
      )
    case 'style':
      return (
        <StyleForm
          selfId={selfId}
          data={data}
          onChange={(val) => onChange(val as SetStateAction<GenreUiState>)}
        />
      )
    case 'trend':
      return (
        <TrendForm
          selfId={selfId}
          data={data}
          onChange={(val) => onChange(val as SetStateAction<GenreUiState>)}
        />
      )
  }
}

export default GenreForm
