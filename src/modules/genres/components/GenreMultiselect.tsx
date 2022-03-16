import { useMemo } from 'react'

import trpc from '../../../common/utils/trpc'
import { GenreOutputsMap } from '../utils/genres'
import Multiselect from './Multiselect'

export type GenreMultiselectProps<K extends keyof GenreOutputsMap> = {
  selfId?: number
  value: GenreOutputsMap[K][]
  onChange: (value: GenreOutputsMap[K][]) => void
  types: K[]
}

const GenreMultiselect = <K extends keyof GenreOutputsMap>({
  selfId,
  value,
  onChange,
  types,
}: GenreMultiselectProps<K>) => {
  const { data, error, isLoading } = trpc.useQuery(['genres', { type: types }])

  const dataWithoutSelf = useMemo(
    () =>
      selfId === undefined
        ? data
        : data?.filter(
            (item) => !(item.type === 'trend' && item.id === selfId)
          ),
    [data, selfId]
  )

  return (
    <Multiselect
      data={dataWithoutSelf}
      error={error}
      isLoading={isLoading}
      filter={(item, query) =>
        item.name.toLowerCase().startsWith(query.toLowerCase())
      }
      itemDisplay={(item) => item.name}
      itemKey={(item) => item.id}
      selected={value}
      onChange={(selected) => onChange(selected as never)}
    />
  )
}

export default GenreMultiselect
