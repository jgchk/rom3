import styled from '@emotion/styled'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { GenreType } from '../../../../../common/model'
import { genreParentTypes } from '../../../../../common/model/parents'
import useGenre from '../../../hooks/useGenre'
import useGenres from '../../../hooks/useGenres'
import { CorrectionIdApiInput } from '../../../services'
import { toCorrectionIdApiInputKey } from '../../../utils/keys'

const ParentMultiselect: FC<{
  value: CorrectionIdApiInput[]
  onChange: (value: CorrectionIdApiInput[]) => void
  childType: GenreType
}> = ({ value, onChange, childType }) => {
  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)

  const parentTypes = useMemo(() => genreParentTypes[childType], [childType])

  const removeSelectedItem = useCallback(
    (removeItem: CorrectionIdApiInput) =>
      onChange(
        value.filter(
          (item) =>
            toCorrectionIdApiInputKey(item) !==
            toCorrectionIdApiInputKey(removeItem)
        )
      ),
    [onChange, value]
  )

  const addSelectedItem = useCallback(
    (addItem: CorrectionIdApiInput) => onChange([...value, addItem]),
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

  const { data } = useGenres()

  // TODO
  const self: CorrectionIdApiInput | undefined = undefined

  const selectedKeys = useMemo(
    () => value.map(toCorrectionIdApiInputKey),
    [value]
  )

  const filteredData = useMemo(
    () =>
      data?.filter((item) => {
        const key = toCorrectionIdApiInputKey(item.id)
        return (
          parentTypes.includes(item.data.type) &&
          (self ? toCorrectionIdApiInputKey(self) !== key : true) &&
          !selectedKeys.includes(key) &&
          item.data.name.toLowerCase().startsWith(inputValue.toLowerCase())
        )
      }),
    [data, inputValue, parentTypes, selectedKeys, self]
  )

  const renderFilteredItems = useCallback(() => {
    if (!filteredData) return <div>Loading...</div>
    if (filteredData.length === 0) return <div>No items</div>
    return filteredData.map((item) => (
      <MenuItem
        key={toCorrectionIdApiInputKey(item.id)}
        type='button'
        onClick={() => addSelectedItem(item.id)}
      >
        {item.data.name}
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
                key={toCorrectionIdApiInputKey(selectedItem)}
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
  id: CorrectionIdApiInput
  onRemove: () => void
}> = ({ id, onRemove }) => {
  const { data, error } = useGenre(id)

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
