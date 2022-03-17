import { useCallback, useMemo } from 'react'

import { isDefined } from '../../../common/utils/types'
import { useEditContext } from '../contexts/EditContext'
import { useGenresQuery } from '../services'
import { getGenreKey } from '../utils/types'
import { InfluenceUiState, InfluenceUiStateMap } from '../utils/types/influence'
import {
  isStyleInfluence,
  makeStyleInfluenceUiState,
} from '../utils/types/styles'
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
  const {
    data: originalData,
    error,
    isLoading,
  } = useGenresQuery({ type: types })
  const data: InfluenceUiState[] | undefined = useMemo(() => {
    if (originalData === undefined) return
    return originalData
      .map((item) => {
        switch (item.type) {
          case 'meta':
            return
          case 'scene':
            return item
          case 'style': {
            return makeStyleInfluenceUiState(item)
          }
          case 'trend':
            return item
        }
      })
      .filter(isDefined)
  }, [originalData])

  const getItemKey = useCallback(
    (item: InfluenceUiState) =>
      isStyleInfluence(item)
        ? `${getGenreKey(item.style)}_${item.influenceType}`
        : getGenreKey(item),
    []
  )

  const self = useEditContext()

  const dataWithoutSelf = useMemo(() => {
    if (self === undefined) return data
    const selfKey = getGenreKey(self)
    return data?.filter((item) => getItemKey(item) !== selfKey)
  }, [data, getItemKey, self])

  const filter = useCallback((item: InfluenceUiState, query: string) => {
    const itemName = isStyleInfluence(item) ? item.style.name : item.name
    return itemName.toLowerCase().startsWith(query.toLowerCase())
  }, [])

  const renderItem = useCallback((item: InfluenceUiState) => {
    console.log(item)
    return isStyleInfluence(item) ? (
      <div>
        <div>{item.style.name}</div>
        <label>
          <input type='checkbox' />
          Historical
        </label>
      </div>
    ) : (
      item.name
    )
  }, [])

  return (
    <Multiselect
      data={dataWithoutSelf}
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
