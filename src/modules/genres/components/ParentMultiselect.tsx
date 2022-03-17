import { useMemo } from 'react'

import { useEditContext } from '../contexts/EditContext'
import { useGenresQuery } from '../services'
import { getGenreKey } from '../utils/types'
import { ParentUiState, ParentUiStateMap } from '../utils/types/parents'
import Multiselect from './Multiselect'

export type ParentMultiselectProps<
  K extends keyof ParentUiStateMap = keyof ParentUiStateMap
> = {
  value: ParentUiStateMap[K][]
  onChange: (value: ParentUiStateMap[K][]) => void
  types: K[]
}

const ParentMultiselect = <K extends keyof ParentUiStateMap>({
  value,
  onChange,
  types,
}: ParentMultiselectProps<K>) => {
  const { data, error, isLoading } = useGenresQuery({ type: types })

  const self = useEditContext()

  const dataWithoutSelf = useMemo(() => {
    if (self === undefined) return data
    const selfKey = getGenreKey(self)
    return data?.filter((item) => getGenreKey(item) !== selfKey)
  }, [data, self])

  return (
    <Multiselect
      data={dataWithoutSelf as ParentUiState[]}
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

export default ParentMultiselect
