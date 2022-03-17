import { useCallback, useMemo } from 'react'

import { useEditContext } from '../contexts/EditContext'
import { useGenresQuery } from '../services'
import { getGenreKey } from '../utils/types'
import { InfluenceUiState, InfluenceUiStateMap } from '../utils/types/influence'
import { isStyleInfluence } from '../utils/types/styles'
import Multiselect from './Multiselect'

export type InfluenceMultiselectProps<
  K extends keyof InfluenceUiStateMap = keyof InfluenceUiStateMap
> = {
  value: InfluenceUiStateMap[K][]
  onChange: (value: InfluenceUiStateMap[K][]) => void
  types: K[]
}

const InfluenceMultiselect = <K extends keyof InfluenceUiStateMap>({
  value,
  onChange,
  types,
}: InfluenceMultiselectProps<K>) => {
  const { data, error, isLoading } = useGenresQuery({ type: types })

  const self = useEditContext()

  const dataWithoutSelf = useMemo(() => {
    if (self === undefined) return data
    const selfKey = getGenreKey(self)
    return data?.filter((item) => getGenreKey(item) !== selfKey)
  }, [data, self])

  const filter = useCallback((item: InfluenceUiState, query: string) => {
    const itemName = isStyleInfluence(item) ? item.style.name : item.name
    return itemName.toLowerCase().startsWith(query.toLowerCase())
  }, [])

  const renderItem = useCallback((item: InfluenceUiState) => {
    return isStyleInfluence(item) ? item.style.name : item.name
  }, [])

  const getItemKey = useCallback(
    (item: InfluenceUiState) =>
      isStyleInfluence(item)
        ? `${item.style.type}_${item.style.id}_${item.influenceType}`
        : `${item.type}_${item.id}`,
    []
  )

  return (
    <Multiselect
      data={dataWithoutSelf as InfluenceUiState[]}
      error={error}
      isLoading={isLoading}
      filter={(item, query) => filter(item, query)}
      itemDisplay={(item) => renderItem(item)}
      itemKey={(item) => getItemKey(item)}
      selected={value}
      onChange={(selected) => onChange(selected as never)}
    />
  )
}

export default InfluenceMultiselect
