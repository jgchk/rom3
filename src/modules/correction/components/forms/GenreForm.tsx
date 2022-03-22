import { Dispatch, FC, SetStateAction } from 'react'

import { GenreApiInput } from '../../../server/routers/genres'
import MetaForm from './MetaForm'

const GenreForm: FC<{
  data: GenreApiInput
  onChange: Dispatch<SetStateAction<GenreApiInput>>
}> = ({ data, onChange }) => {
  switch (data.type) {
    case 'META':
      return <MetaForm data={data} onChange={onChange} />
    case 'SCENE':
      // TODO
      return <MetaForm data={data} onChange={onChange} />
    case 'STYLE':
      // TODO
      return <MetaForm data={data} onChange={onChange} />
    case 'TREND':
      // TODO
      return <MetaForm data={data} onChange={onChange} />
  }
}

export default GenreForm
