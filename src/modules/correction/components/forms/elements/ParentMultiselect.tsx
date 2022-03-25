import clsx from 'clsx'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RiCloseFill } from 'react-icons/ri'

import { GenreType } from '../../../../../common/model'
import { genreParentTypes } from '../../../../../common/model/parents'
import { useCorrectionContext } from '../../../contexts/CorrectionContext'
import useCorrectionGenreQuery from '../../../hooks/useCorrectionGenreQuery'
import useCorrectionGenresQuery from '../../../hooks/useCorrectionGenresQuery'

const ParentMultiselect: FC<{
  parents: number[]
  onChange: (value: number[]) => void
  childType: GenreType
  selfId?: number
}> = ({ parents, onChange, childType, selfId }) => {
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

  const options = useMemo(
    () =>
      data?.filter(
        (item) =>
          parentTypes.includes(item.type) &&
          (selfId !== undefined ? selfId !== item.id : true) &&
          !parents.includes(item.id) &&
          item.name.toLowerCase().startsWith(inputValue.toLowerCase())
      ),
    [data, parentTypes, selfId, parents, inputValue]
  )

  const renderOptions = useCallback(() => {
    if (!options) return <div>Loading...</div>
    if (options.length === 0) return <div>No items</div>
    return options.map((item) => (
      <li key={item.id}>
        <button
          className='w-full text-left'
          type='button'
          onClick={() => {
            addParent(item.id)
            setInputValue('')
          }}
        >
          {item.name}
        </button>
      </li>
    ))
  }, [addParent, options])

  return (
    <div className='relative' ref={containerRef}>
      <div className='flex space-x-1 w-full border border-gray-300'>
        {parents.length > 0 && (
          <div className='flex space-x-1 p-1'>
            {parents.map((selectedItem) => (
              <SelectedParent
                key={selectedItem}
                id={selectedItem}
                onRemove={() => removeParent(selectedItem)}
                childType={childType}
              />
            ))}
          </div>
        )}
        <input
          className='flex-1'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setOpen(true)}
        />
        <button type='button' onClick={() => setOpen(!open)}>
          &#8595;
        </button>
      </div>
      {open && (
        <ul className='absolute z-10 w-full bg-white border border-t-0 border-gray-200'>
          {renderOptions()}
        </ul>
      )}
    </div>
  )
}

const SelectedParent: FC<{
  id: number
  onRemove: () => void
  childType: GenreType
}> = ({ id, onRemove, childType }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data } = useCorrectionGenreQuery(id, correctionId)

  const isInvalid = useMemo(() => {
    if (!data) return false

    const parentTypes = genreParentTypes[childType]
    return !parentTypes.includes(data.type)
  }, [childType, data])

  const renderText = useCallback(() => {
    if (data) return data.name
    return 'Loading...'
  }, [data])

  return (
    <div
      className={clsx(
        'flex border',
        isInvalid
          ? 'border-red-400 bg-red-200 text-red-600'
          : 'border-gray-400 bg-gray-200 text-gray-600'
      )}
    >
      <div className='px-2 py-0.5 text-sm font-medium'>{renderText()}</div>
      <button
        className={clsx(
          'border-l h-full px-1',
          isInvalid
            ? 'border-red-300 hover:bg-red-300'
            : 'border-gray-300 hover:bg-gray-300'
        )}
        type='button'
        onClick={() => onRemove()}
      >
        <RiCloseFill />
      </button>
    </div>
  )
}

export default ParentMultiselect
