import { Dispatch, FC, SetStateAction } from 'react'

import { GenreApiInput } from '../../../server/routers/genres'
import MetaForm from './MetaForm'
import SceneForm from './SceneForm'
import StyleForm from './StyleForm'
import TrendForm from './TrendForm'

const GenreForm: FC<{
  data: GenreApiInput
  onChange: Dispatch<SetStateAction<GenreApiInput>>
}> = ({ data, onChange }) => {
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
}

export default GenreForm
