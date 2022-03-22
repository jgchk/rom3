import { Dispatch, FC, SetStateAction } from 'react'

import { GenreApiInput } from '../../../server/routers/genres'
import MetaForm from './MetaForm'

const GenreForm: FC<{
  data: GenreApiInput
  onChange: Dispatch<SetStateAction<GenreApiInput>>
  correctionId: number
}> = ({ data, onChange, correctionId }) => {
  switch (data.type) {
    case 'META':
      return (
        <MetaForm data={data} onChange={onChange} correctionId={correctionId} />
      )
    case 'SCENE':
      // TODO
      return (
        <MetaForm data={data} onChange={onChange} correctionId={correctionId} />
      )
    case 'STYLE':
      // TODO
      return (
        <MetaForm data={data} onChange={onChange} correctionId={correctionId} />
      )
    case 'TREND':
      // TODO
      return (
        <MetaForm data={data} onChange={onChange} correctionId={correctionId} />
      )
  }
}

export default GenreForm
