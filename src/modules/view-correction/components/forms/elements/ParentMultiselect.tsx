import styled from '@emotion/styled'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { GenreType } from '../../../../../common/model'
import { genreParentTypes } from '../../../../../common/model/parents'
import { useCorrectionContext } from '../../../contexts/CorrectionContext'
import useCorrectionGenreQuery from '../../../hooks/useCorrectionGenreQuery'
import useCorrectionGenresQuery from '../../../hooks/useCorrectionGenresQuery'

const ParentMultiselect: FC<{
  value: number[]
  onChange: (value: number[]) => void
  childType: GenreType
}> = ({ value, onChange, childType }) => {
  const { id: correctionId } = useCorrectionContext()

  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)

  const parentTypes = useMemo(() => genreParentTypes[childType], [childType])

  const removeSelectedItem = useCallback(
    (removeItem: number) =>
      onChange(value.filter((item) => item !== removeItem)),
    [onChange, value]
  )

  const addSelectedItem = useCallback(
    (addItem: number) => onChange([...value, addItem]),
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

  // TODO
  const self: number | undefined = undefined

  const filteredData = useMemo(
    () =>
      data?.filter((item) => {
        return (
          parentTypes.includes(item.type) &&
          (self ? self !== item.id : true) &&
          !value.includes(item.id) &&
          item.name.toLowerCase().startsWith(inputValue.toLowerCase())
        )
      }),
    [data, inputValue, parentTypes, self, value]
  )

  const renderFilteredItems = useCallback(() => {
    if (!filteredData) return <div>Loading...</div>
    if (filteredData.length === 0) return <div>No items</div>
    return filteredData.map((item) => (
      <MenuItem
        key={item.id}
        type='button'
        onClick={() => addSelectedItem(item.id)}
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
              <SelectedItemm
                key={selectedItem}
                id={selectedItem}
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

const SelectedItemm: FC<{
  id: number
  onRemove: () => void
}> = ({ id, onRemove }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data, error } = useCorrectionGenreQuery(id, correctionId)

  const renderText = useCallback(() => {
    if (data) return data.name
    if (error) return 'Error'
    return 'Loading...'
  }, [data, error])

  return (
    <SelectedItem>
      {renderText()}
      <RemoveButton type='button' onClick={() => onRemove()}>
        &#10005;
      </RemoveButton>
    </SelectedItem>
  )
}

export default ParentMultiselect

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

const SelectedItem = styled.div`
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
