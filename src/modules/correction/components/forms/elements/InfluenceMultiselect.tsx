import styled from '@emotion/styled'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import Select from '../../../../../common/components/Select'
import { GenreType } from '../../../../../common/model'
import {
  genreInfluencedByTypes,
  influenceTypes,
} from '../../../../../common/model/influences'
import { capitalize } from '../../../../../common/utils/string'
import { InferMutationInput } from '../../../../../common/utils/trpc'
import { useCorrectionContext } from '../../../contexts/CorrectionContext'
import useCorrectionGenreQuery from '../../../hooks/useCorrectionGenreQuery'
import useCorrectionGenresQuery from '../../../hooks/useCorrectionGenresQuery'

type InfluenceUiState = InferMutationInput<'genres.add'>['influencedBy'][number]
const infEq = (a: InfluenceUiState, b: InfluenceUiState) =>
  a.id === b.id && a.influenceType === b.influenceType

const InfluenceMultiselect: FC<{
  value: InfluenceUiState[]
  onChange: (value: InfluenceUiState[]) => void
  childType: GenreType
}> = ({ value, onChange, childType }) => {
  const { id: correctionId } = useCorrectionContext()

  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)

  const influencedByTypes = useMemo(
    () => genreInfluencedByTypes[childType],
    [childType]
  )

  const removeSelectedItem = useCallback(
    (removeItem: InfluenceUiState) =>
      onChange(value.filter((item) => !infEq(item, removeItem))),
    [onChange, value]
  )

  const addSelectedItem = useCallback(
    (addItem: InfluenceUiState) => onChange([...value, addItem]),
    [onChange, value]
  )

  const updateSelectedItem = useCallback(
    (updatedItem: InfluenceUiState) =>
      onChange(
        value.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      ),
    [onChange, value]
  )

  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (
        containerRef.current &&
        e.target &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('click', listener)
    return () => document.removeEventListener('click', listener)
  }, [])

  const { data } = useCorrectionGenresQuery(correctionId)

  const { id: self } = useCorrectionContext()

  const filteredData = useMemo(
    () =>
      data?.filter(
        (item) =>
          influencedByTypes.includes(item.type) &&
          (self ? self !== item.id : true) &&
          !value.some((selectedItem) => infEq(selectedItem, item)) &&
          item.name.toLowerCase().startsWith(inputValue.toLowerCase())
      ),
    [data, inputValue, influencedByTypes, self, value]
  )

  const renderFilteredItems = useCallback(() => {
    if (!filteredData) return <div>Loading...</div>
    if (filteredData.length === 0) return <div>No items</div>
    return filteredData.map((item) => (
      <MenuItem
        key={item.id}
        type='button'
        onClick={() =>
          addSelectedItem({ id: item.id, influenceType: 'HISTORICAL' })
        }
      >
        {item.name}
      </MenuItem>
    ))
  }, [addSelectedItem, filteredData])

  return (
    <Container ref={containerRef}>
      <InputContainer>
        {value.length > 0 && (
          <SelectedItems>
            {value.map((selectedItem) => (
              <SelectedItem
                key={`${selectedItem.id}_${selectedItem.influenceType ?? ''}`}
                influence={selectedItem}
                onChange={() => updateSelectedItem(selectedItem)}
                onRemove={() => removeSelectedItem(selectedItem)}
              />
            ))}
          </SelectedItems>
        )}
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setOpen(true)}
        />
        <button type='button' onClick={() => setOpen(!open)}>
          &#8595;
        </button>
      </InputContainer>
      {open && <Menu>{renderFilteredItems()}</Menu>}
    </Container>
  )
}

const SelectedItem: FC<{
  influence: InfluenceUiState
  onChange: (value: InfluenceUiState) => void
  onRemove: () => void
}> = ({ influence, onChange, onRemove }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data } = useCorrectionGenreQuery(influence.id, correctionId)

  const renderItem = useCallback(() => {
    if (data) {
      if (data.type === 'STYLE') {
        return (
          <div>
            <div>{data.name}</div>
            <Select
              options={influenceTypes.map((infType) => ({
                key: infType,
                value: infType,
                label: capitalize(infType),
              }))}
              value={influence.influenceType ?? 'HISTORICAL'}
              onChange={(influenceType) =>
                onChange({ ...influence, influenceType })
              }
            />
          </div>
        )
      }
      return data.name
    }
    return 'Loading...'
  }, [data, influence, onChange])

  return (
    <SelectedItemContainer>
      {renderItem()}
      <RemoveButton type='button' onClick={() => onRemove()}>
        &#10005;
      </RemoveButton>
    </SelectedItemContainer>
  )
}

export default InfluenceMultiselect

const Container = styled.div`
  position: relative;
`

const InputContainer = styled.div`
  display: flex;
  gap: 2px;
  width: 100%;
  border: 1px solid black;
  border-radius: 2px;
`

const SelectedItems = styled.div`
  display: flex;
  gap: 2px;
  padding: 2px;
`

const SelectedItemContainer = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  padding-left: 4px;
  background: #eee;
  border: 1px solid black;
  border-radius: 2px;
`

const RemoveButton = styled.button`
  border: none;
  border-left: 1px solid black;
`

const Input = styled.input`
  flex: 1;
  border: none;
`

const Menu = styled.ul`
  position: absolute;
  z-index: 100;
  width: 100%;
  margin: 0;
  padding: 0;
  background: white;
  border: 1px solid black;
`

const MenuItem = styled.button`
  width: 100%;
  text-align: left;
`
