import { useCallback, useMemo } from 'react'

import { isDefined } from '../../../common/utils/types'
import { useEditContext } from '../contexts/EditContext'
import { getGenreKey } from '../model'
import { ParentUiState, ParentUiStateMap } from '../model/parents'
import { useGenresQuery } from '../services'
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
  const {
    data: originalData,
    error,
    isLoading,
  } = useGenresQuery({ type: types })

  const data: ParentUiState[] | undefined = useMemo(() => {
    if (originalData === undefined) return
    return originalData
      .map((item) => (item.type === 'scene' ? undefined : item))
      .filter(isDefined)
  }, [originalData])

  const self = useEditContext()

  const dataWithoutSelf = useMemo(() => {
    if (self === undefined) return data
    const selfKey = getGenreKey(self)
    return data?.filter((item) => getGenreKey(item) !== selfKey)
  }, [data, self])

  const filter = useCallback(
    (item: ParentUiState, query: string) =>
      item.name.toLowerCase().startsWith(query.toLowerCase()),
    []
  )

  return (
    <Multiselect
      data={dataWithoutSelf}
      error={error}
      isLoading={isLoading}
      filter={(item, query) => filter(item, query)}
      itemDisplay={(item) => item.name}
      itemKey={(item) => getGenreKey(item)}
      selected={value}
      onChange={(selected) => onChange(selected as never)}
    />
  )
}

export default ParentMultiselect
