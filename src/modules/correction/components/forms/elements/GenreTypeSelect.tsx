import { FC, useMemo } from 'react'

import Select from '../../../../../common/components/Select'
import { GenreType, genreTypes } from '../../../../../common/model'
import { capitalize } from '../../../../../common/utils/string'

const GenreTypeSelect: FC<{
  value: GenreType
  onChange: (value: GenreType) => void
}> = ({ value, onChange }) => {
  const options = useMemo(
    () =>
      genreTypes.map((genreName) => ({
        key: genreName,
        value: genreName,
        label: capitalize(genreName),
      })),
    []
  )

  return (
    <Select value={value} onChange={(val) => onChange(val)} options={options} />
  )
}

export default GenreTypeSelect
