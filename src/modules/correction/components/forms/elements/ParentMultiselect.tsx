import clsx from 'clsx'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'
import { RiArrowDownSLine, RiArrowUpSLine, RiCloseFill } from 'react-icons/ri'

import Tooltip from '../../../../../common/components/Tooltip'
import { GenreType } from '../../../../../common/model'
import { genreParentTypes } from '../../../../../common/model/parents'
import { capitalize } from '../../../../../common/utils/string'
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
    if (!options)
      return <div className='px-1 py-0.5 text-sm text-gray-700'>Loading...</div>

    if (options.length === 0)
      return <div className='px-1 py-0.5 text-sm text-gray-700'>No items</div>

    return options.map((item) => (
      <li className='group hover:bg-gray-100' key={item.id}>
        <button
          className='w-full text-left text-sm text-gray-700 px-1 py-0.5 border-b border-gray-200 group-last:border-0'
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
      <div className='flex border border-gray-300'>
        <div className='flex-1 flex flex-wrap gap-1 w-full p-1'>
          {parents.map((selectedItem) => (
            <SelectedParent
              key={selectedItem}
              id={selectedItem}
              onRemove={() => removeParent(selectedItem)}
              childType={childType}
            />
          ))}
          <input
            className='flex-1 px-1 py-0.5 border border-transparent text-sm'
            placeholder='Search...'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setOpen(true)}
          />
        </div>
        <button
          className='px-1 border-l text-gray-400 border-gray-200 hover:bg-gray-100'
          type='button'
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <RiArrowUpSLine className='pointer-events-none' />
          ) : (
            <RiArrowDownSLine className='pointer-events-none' />
          )}
        </button>
      </div>
      {open && (
        <ul className='absolute z-10 w-full bg-white border border-t-0 border-gray-300'>
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

  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null)

  return (
    <>
      <div
        className={clsx(
          'flex border',
          isInvalid
            ? 'border-red-400 bg-red-200 text-red-600'
            : 'border-gray-400 bg-gray-200 text-gray-600'
        )}
      >
        <div
          ref={setReferenceElement}
          className='flex items-center px-2 py-0.5 text-sm font-medium'
        >
          {isInvalid && <FaExclamationTriangle className='text-base mr-1' />}
          {renderText()}
        </div>
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

      {isInvalid && (
        <Tooltip referenceElement={referenceElement}>
          <span className='font-semibold'>
            {capitalize(childType.toLowerCase())}s
          </span>{' '}
          cannot have{' '}
          <span className='font-semibold'>
            {capitalize(data?.type.toLowerCase() ?? '')}
          </span>{' '}
          parents
        </Tooltip>
      )}
    </>
  )
}

export default ParentMultiselect
