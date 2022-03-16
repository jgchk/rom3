import { useMemo } from 'react'

import { useEditContext } from '../contexts/EditContext'
import { useGenresQuery } from '../services'
import {
  getGenreKey,
  SimpleGenreOutput,
  SimpleGenreOutputMap,
} from '../utils/types'
import Multiselect from './Multiselect'

export type GenreMultiselectProps<
  K extends keyof SimpleGenreOutputMap = keyof SimpleGenreOutputMap
> = {
  value: SimpleGenreOutputMap[K][]
  onChange: (value: SimpleGenreOutputMap[K][]) => void
  types: K[]
}

const GenreMultiselect = <K extends keyof SimpleGenreOutputMap>({
  value,
  onChange,
  types,
}: GenreMultiselectProps<K>) => {
  const { data, error, isLoading } = useGenresQuery({ type: types })

  const self = useEditContext()

  const dataWithoutSelf = useMemo(() => {
    if (self === undefined) return data
    const selfKey = getGenreKey(self)
    return data?.filter((item) => getGenreKey(item) !== selfKey)
  }, [data, self])

  return (
    <Multiselect
      data={dataWithoutSelf as SimpleGenreOutput[]}
      error={error}
      isLoading={isLoading}
      filter={(item, query) =>
        item.name.toLowerCase().startsWith(query.toLowerCase())
      }
      itemDisplay={(item) => item.name}
      itemKey={(item) => `${item.type}_${item.id}`}
      selected={value}
      onChange={(selected) => onChange(selected as never)}
    />
  )
}

export default GenreMultiselect
