import styled from '@emotion/styled'
import { TRPCClientErrorLike } from '@trpc/client'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import type { AppRouter } from '../../server/routers/_app'

type MultiselectProps<T> = {
  data: T[] | undefined
  error: TRPCClientErrorLike<AppRouter> | null
  isLoading: boolean
  filter: (item: T, query: string) => boolean
  itemKey: (item: T) => string | number
  selected: T[]
  onChange: (selected: T[]) => void
} & ItemDisplay<T>
type ItemDisplay<T> =
  | { itemDisplay: (item: T) => ReactNode }
  | {
      selectedItemDisplay: (item: T) => ReactNode
      menuItemDisplay: (item: T) => ReactNode
    }

const Multiselect = <T,>({
  data,
  isLoading,
  filter,
  itemKey,
  selected,
  onChange,
  ...props
}: MultiselectProps<T>) => {
  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)

  const getFilteredItems = useCallback(
    (items: T[]) =>
      items.filter(
        (item) => !selected.includes(item) && filter(item, inputValue)
      ),
    [filter, inputValue, selected]
  )

  const removeSelectedItem = useCallback(
    (removeItem: T) =>
      onChange(
        selected.filter((item) => itemKey(item) !== itemKey(removeItem))
      ),
    [itemKey, onChange, selected]
  )

  const addSelectedItem = useCallback(
    (addItem: T) => onChange([...selected, addItem]),
    [onChange, selected]
  )

  const renderMenuItem = useCallback(
    (item: T) =>
      'itemDisplay' in props
        ? props.itemDisplay(item)
        : props.menuItemDisplay(item),
    [props]
  )

  const renderSelectedItem = useCallback(
    (item: T) =>
      'itemDisplay' in props
        ? props.itemDisplay(item)
        : props.selectedItemDisplay(item),
    [props]
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

  if (data || isLoading) {
    const renderFilteredItems = () => {
      if (!data) return <div>Loading...</div>

      const filteredItems = getFilteredItems(data)
      if (filteredItems.length === 0) return <div>No items</div>
      return filteredItems.map((item) => (
        <MenuItem
          key={itemKey(item)}
          type='button'
          onClick={() => addSelectedItem(item)}
        >
          {renderMenuItem(item)}
        </MenuItem>
      ))
    }

    return (
      <Container ref={containerRef}>
        <InputContainer>
          {selected.length > 0 && (
            <SelectedItems>
              {selected.map((selectedItem) => (
                <SelectedItem key={itemKey(selectedItem)}>
                  {renderSelectedItem(selectedItem)}
                  <RemoveButton
                    type='button'
                    onClick={() => removeSelectedItem(selectedItem)}
                  >
                    &#10005;
                  </RemoveButton>
                </SelectedItem>
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

  return <div>Error</div>
}

export default Multiselect

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
  background: white;
  border: 1px solid black;
`

const MenuItem = styled.button`
  width: 100%;
  text-align: left;
`
