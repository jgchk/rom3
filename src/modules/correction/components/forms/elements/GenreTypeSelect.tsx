import { FC, useMemo } from 'react'

import Select from '../../../../../common/components/Select'
import { GenreType, genreTypes } from '../../../../../common/model'
import { capitalize } from '../../../../../common/utils/string'

const GenreTypeSelect: FC<{
  id?: string
  value: GenreType
  onChange: (value: GenreType) => void
}> = ({ id, value, onChange }) => {
  const options = useMemo(
    () =>
      genreTypes.map((genreName) => ({
        key: genreName,
        value: genreName,
        label: capitalize(genreName.toLowerCase()),
      })),
    []
  )

  return (
    <Select
      id={id}
      value={value}
      onChange={(val) => onChange(val)}
      options={options}
    />
  )
}

export default GenreTypeSelect
