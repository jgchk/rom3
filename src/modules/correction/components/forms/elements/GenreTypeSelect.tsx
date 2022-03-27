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
      className='bg-white shadow-sm border border-stone-300 px-2 py-1 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition'
      value={value}
      onChange={(val) => onChange(val)}
      options={options}
    />
  )
}

export default GenreTypeSelect
