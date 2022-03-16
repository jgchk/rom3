import { useMemo } from 'react'

import trpc from '../../../common/utils/trpc'
import { SimpleGenreOutput, SimpleGenreOutputMap } from '../utils/types'
import Multiselect from './Multiselect'

export type GenreMultiselectProps<K extends keyof SimpleGenreOutputMap> = {
  selfId?: number
  value: SimpleGenreOutputMap[K][]
  onChange: (value: SimpleGenreOutputMap[K][]) => void
  types: K[]
}

const GenreMultiselect = <K extends keyof SimpleGenreOutputMap>({
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
      data={dataWithoutSelf as SimpleGenreOutput[]}
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
