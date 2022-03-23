import styled from '@emotion/styled'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { GenreType } from '../../../../../common/model'
import { genreParentTypes } from '../../../../../common/model/parents'
import { useCorrectionContext } from '../../../contexts/CorrectionContext'
import useCorrectionGenreQuery from '../../../hooks/useCorrectionGenreQuery'
import useCorrectionGenresQuery from '../../../hooks/useCorrectionGenresQuery'

const ParentMultiselect: FC<{
  parents: number[]
  onChange: (value: number[]) => void
  childType: GenreType
}> = ({ parents, onChange, childType }) => {
  const { id: correctionId } = useCorrectionContext()

  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)

  const parentTypes = useMemo(() => genreParentTypes[childType], [childType])

  const addParent = useCallback(
    (addItem: number) => onChange([...parents, addItem]),
    [onChange, parents]
  )

  const removeParent = useCallback(
    (removeItem: number) =>
      onChange(parents.filter((item) => item !== removeItem)),
    [onChange, parents]
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

  const options = useMemo(
    () =>
      data?.filter(
        (item) =>
          parentTypes.includes(item.type) &&
          (self ? self !== item.id : true) &&
          !parents.includes(item.id) &&
          item.name.toLowerCase().startsWith(inputValue.toLowerCase())
      ),
    [data, inputValue, parentTypes, self, parents]
  )

  const renderOptions = useCallback(() => {
    if (!options) return <div>Loading...</div>
    if (options.length === 0) return <div>No items</div>
    return options.map((item) => (
      <MenuItem key={item.id} type='button' onClick={() => addParent(item.id)}>
        {item.name}
      </MenuItem>
    ))
  }, [addParent, options])

  return (
    <Container ref={containerRef}>
      <InputContainer>
        {parents.length > 0 && (
          <SelectedItems>
            {parents.map((selectedItem) => (
              <SelectedParent
                key={selectedItem}
                id={selectedItem}
                onRemove={() => removeParent(selectedItem)}
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
      {open && <Menu>{renderOptions()}</Menu>}
    </Container>
  )
}

const SelectedParent: FC<{
  id: number
  onRemove: () => void
}> = ({ id, onRemove }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data } = useCorrectionGenreQuery(id, correctionId)

  const renderText = useCallback(() => {
    if (data) return data.name
    return 'Loading...'
  }, [data])

  return (
    <SelectedItemContainer>
      {renderText()}
      <RemoveButton type='button' onClick={() => onRemove()}>
        &#10005;
      </RemoveButton>
    </SelectedItemContainer>
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
