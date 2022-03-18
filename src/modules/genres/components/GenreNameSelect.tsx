import { FC, useMemo } from 'react'

import Select from '../../../common/components/Select'
import { capitalize } from '../../../common/utils/string'
import { GenreName, genreNames } from '../model'

const GenreNameSelect: FC<{
  value: GenreName
  onChange: (value: GenreName) => void
}> = ({ value, onChange }) => {
  const options = useMemo(
    () =>
      genreNames.map((genreName) => ({
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

export default GenreNameSelect
