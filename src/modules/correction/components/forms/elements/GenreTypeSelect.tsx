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
        label: capitalize(genreName.toLowerCase()),
      })),
    []
  )

  return (
    <Select
      className='px-1 py-0.5 border border-stone-300 bg-stone-200'
      value={value}
      onChange={(val) => onChange(val)}
      options={options}
    />
  )
}

export default GenreTypeSelect
