import styled from '@emotion/styled'
import { useCallback, useMemo } from 'react'

import Select from '../../../common/components/Select'
import { capitalize } from '../../../common/utils/string'
import { isDefined } from '../../../common/utils/types'
import { useEditContext } from '../contexts/EditContext'
import { useGenresQuery } from '../services'
import { getGenreKey } from '../utils/types'
import { InfluenceUiState, InfluenceUiStateMap } from '../utils/types/influence'
import {
  influenceTypes,
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

  const self = useEditContext()

  const dataWithoutSelf = useMemo(() => {
    if (self === undefined) return data
    const selfKey = getGenreKey(self)
    return data?.filter((item) => getGenreKey(item) !== selfKey)
  }, [data, self])

  const filter = useCallback(
    (item: InfluenceUiState, query: string) =>
      item.name.toLowerCase().startsWith(query.toLowerCase()),
    []
  )

  const influenceTypeOptions = useMemo(
    () =>
      influenceTypes.map((it) => ({
        key: it,
        value: it,
        label: capitalize(it.toLowerCase()),
      })),
    []
  )

  const renderItem = useCallback(
    (item: InfluenceUiState) =>
      isStyleInfluence(item) ? (
        <StyleInfluenceContainer>
          {item.name}
          <Select
            options={influenceTypeOptions}
            value={item.influenceType}
            onChange={(val) =>
              onChange(
                value.map((v) =>
                  getGenreKey(v) === getGenreKey(item)
                    ? { ...v, influenceType: val }
                    : v
                )
              )
            }
          />
        </StyleInfluenceContainer>
      ) : (
        item.name
      ),
    [influenceTypeOptions, onChange, value]
  )

  return (
    <Multiselect
      data={dataWithoutSelf}
      error={error}
      isLoading={isLoading}
      filter={(item, query) => filter(item, query)}
      menuItemDisplay={(item) => item.name}
      selectedItemDisplay={(item) => renderItem(item)}
      itemKey={(item) => getGenreKey(item)}
      selected={value}
      onChange={(selected) => onChange(selected as never)}
    />
  )
}

export default InfluenceMultiselect

const StyleInfluenceContainer = styled.div`
  display: flex;
  gap: 6px;
`
