import { Dispatch, FC, SetStateAction } from 'react'

import { CorrectionGenreApiInputData } from '../../services'
import MetaForm from './MetaForm'

const GenreForm: FC<{
  data: CorrectionGenreApiInputData
  onChange: Dispatch<SetStateAction<CorrectionGenreApiInputData>>
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
