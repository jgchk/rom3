import { TRPCClientErrorLike } from '@trpc/client'
import { useCombobox, useMultipleSelection } from 'downshift'
import { useCallback, useState } from 'react'
import type { AppRouter } from '../pages/api/trpc/[trpc]'

type MultiselectProps<T> = {
  data: T[] | undefined
  error: TRPCClientErrorLike<AppRouter> | null
  isLoading: boolean
  filter: (item: T, query: string) => boolean
  itemDisplay: (item: T) => string
  itemKey: (item: T) => string | number
  onChange: (selected: T[]) => void
}

const Multiselect = <T,>({
  data,
  error,
  filter,
  itemDisplay,
  itemKey,
  onChange,
}: MultiselectProps<T>) => {
  const [inputValue, setInputValue] = useState('')

  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection<T>({
    onSelectedItemsChange: ({ selectedItems }) => onChange(selectedItems ?? []),
  })

  const getFilteredItems = useCallback(
    (items: T[]) =>
      items.filter(
        (item) => !selectedItems.includes(item) && filter(item, inputValue)
      ),
    [filter, inputValue, selectedItems]
  )

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectItem,
  } = useCombobox<T | null>({
    inputValue,
    items: getFilteredItems(data ?? []),
    onStateChange: ({ inputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(inputValue ?? '')

          break
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (selectedItem) {
            setInputValue('')
            addSelectedItem(selectedItem)
            selectItem(null)
          }

          break
        default:
          break
      }
    },
  })

  if (data) {
    return (
      <div>
        <label {...getLabelProps()}>Choose some elements:</label>
        <div>
          {selectedItems.map((selectedItem, index) => (
            <span
              key={`selected-item-${index}`}
              {...getSelectedItemProps({ selectedItem, index })}
            >
              {itemDisplay(selectedItem)}
              <span onClick={() => removeSelectedItem(selectedItem)}>
                &#10005;
              </span>
            </span>
          ))}
          <div {...getComboboxProps()}>
            <input
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
            />
            <button
              type='button'
              {...getToggleButtonProps()}
              aria-label={'toggle menu'}
            >
              &#8595;
            </button>
          </div>
        </div>
        <ul {...getMenuProps()}>
          {isOpen &&
            getFilteredItems(data ?? []).map((item, index) => (
              <li
                style={
                  highlightedIndex === index
                    ? { backgroundColor: '#bde4ff' }
                    : {}
                }
                key={itemKey(item)}
                {...getItemProps({ item, index })}
              >
                {itemDisplay(item)}
              </li>
            ))}
        </ul>
      </div>
    )
  }

  if (error) {
    return <div>Error</div>
  }

  return <div>Loading...</div>
}

export default Multiselect
