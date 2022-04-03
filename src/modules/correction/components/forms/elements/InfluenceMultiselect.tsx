import clsx from 'clsx'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'
import { RiArrowDownSLine, RiArrowUpSLine, RiCloseFill } from 'react-icons/ri'

import Loader from '../../../../../common/components/Loader'
import Select from '../../../../../common/components/Select'
import Tooltip from '../../../../../common/components/Tooltip'
import { GenreType } from '../../../../../common/model'
import {
  genreInfluencedByTypes,
  influenceTypes,
} from '../../../../../common/model/influences'
import { ApiGenreInfluence } from '../../../../../common/services/genres'
import { capitalize } from '../../../../../common/utils/string'
import { useCorrectionContext } from '../../../contexts/CorrectionContext'
import useCorrectionGenreQuery from '../../../hooks/useCorrectionGenreQuery'
import useCorrectionGenresQuery from '../../../hooks/useCorrectionGenresQuery'
import { CorrectionGenre } from '../../../utils/genre'

const makeInfluence = (item: CorrectionGenre): ApiGenreInfluence => ({
  id: item.id,
  influenceType: item.type === 'STYLE' ? 'HISTORICAL' : undefined,
})

const InfluenceMultiselect: FC<{
  id?: string
  influences: ApiGenreInfluence[]
  onChange: (value: ApiGenreInfluence[]) => void
  childType: GenreType
  selfId?: number
}> = ({ id, influences, onChange, childType, selfId }) => {
  const { id: correctionId } = useCorrectionContext()

  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (inputValue.length > 0) {
      setOpen(true)
    }
  }, [inputValue.length])

  const influencedByTypes = useMemo(
    () => genreInfluencedByTypes[childType],
    [childType]
  )

  const addInfluence = useCallback(
    (add: ApiGenreInfluence) => onChange([...influences, add]),
    [onChange, influences]
  )

  const removeInfluence = useCallback(
    (remove: ApiGenreInfluence) =>
      onChange(influences.filter((item) => item.id !== remove.id)),
    [onChange, influences]
  )

  const updateInfluence = useCallback(
    (update: ApiGenreInfluence) =>
      onChange(
        influences.map((item) => (item.id === update.id ? update : item))
      ),
    [onChange, influences]
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
      data
        ?.filter(
          (item) =>
            influencedByTypes.includes(item.type) &&
            (selfId !== undefined ? selfId !== item.id : true) &&
            !influences.some(
              (selectedInfluence) => item.id === selectedInfluence.id
            ) &&
            item.name.toLowerCase().includes(inputValue.toLowerCase())
        )
        .sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        ),
    [data, influencedByTypes, selfId, influences, inputValue]
  )

  const renderOptions = useCallback(() => {
    if (!options) {
      return <Loader className='p-2 text-stone-700' size={18} />
    }

    if (options.length === 0) {
      return <div className='px-2 py-1 text-sm text-stone-700'>No items</div>
    }

    return options.map((item) => (
      <li className='group hover:bg-stone-100' key={item.id}>
        <button
          className='w-full text-left text-sm text-stone-700 px-2 py-1 border-b border-stone-200 group-last:border-0'
          type='button'
          onClick={() => {
            addInfluence(makeInfluence(item))
            setInputValue('')
          }}
        >
          {item.name}
        </button>
      </li>
    ))
  }, [addInfluence, options])

  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className='relative' ref={containerRef}>
      <div className='flex bg-white shadow-sm border border-stone-300 focus-within:border-primary-500 ring-0 focus-within:ring-1 focus-within:ring-primary-500 transition'>
        <div
          className='flex-1 flex flex-wrap gap-1 w-full p-1'
          onClick={() => {
            setOpen(!open)
            inputRef.current?.focus()
          }}
        >
          {influences.map((selectedItem) => (
            <SelectedInfluence
              key={`${selectedItem.id}_${selectedItem.influenceType ?? ''}`}
              influence={selectedItem}
              onChange={(update) => updateInfluence(update)}
              onRemove={() => removeInfluence(selectedItem)}
              childType={childType}
            />
          ))}
          <input
            ref={inputRef}
            id={id}
            className='flex-1 border border-transparent focus:outline-none'
            placeholder='Search...'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Tab' || e.key === 'Enter') {
                const topOption = options?.[0]
                if (
                  (inputValue.length === 0 && !open) ||
                  topOption === undefined
                ) {
                  setOpen(false)
                  return
                }

                e.preventDefault()
                addInfluence(makeInfluence(topOption))
                setInputValue('')
                setOpen(false)
              } else if (
                e.key === 'Backspace' &&
                inputValue.length === 0 &&
                influences.length > 0
              ) {
                e.preventDefault()
                removeInfluence(influences[influences.length - 1])
              }
            }}
            autoComplete='off'
          />
        </div>
        <button
          className='px-1 border-l text-stone-400 border-stone-200 hover:bg-stone-100'
          type='button'
          onClick={() => {
            setOpen(!open)
            inputRef.current?.focus()
          }}
          tabIndex={-1}
        >
          {open ? (
            <RiArrowUpSLine className='pointer-events-none' />
          ) : (
            <RiArrowDownSLine className='pointer-events-none' />
          )}
        </button>
      </div>
      {open && (
        <ul
          className='absolute z-10 w-full bg-white border border-stone-300 shadow max-h-64 overflow-auto'
          style={{ top: 'calc(100% - 1px)' }}
        >
          {renderOptions()}
        </ul>
      )}
    </div>
  )
}

const SelectedInfluence: FC<{
  influence: ApiGenreInfluence
  onChange: (value: ApiGenreInfluence) => void
  onRemove: () => void
  childType: GenreType
}> = ({ influence, onChange, onRemove, childType }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data } = useCorrectionGenreQuery(influence.id, correctionId)

  const isInvalid = useMemo(() => {
    if (!data) return false

    const influencedByTypes = genreInfluencedByTypes[childType]
    return !influencedByTypes.includes(data.type)
  }, [childType, data])

  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null)

  const renderItem = useCallback(() => {
    if (data) {
      if (data.type === 'STYLE') {
        return (
          <div className='flex text-sm font-medium'>
            <div
              className='flex items-center px-2 py-0.5'
              ref={setReferenceElement}
            >
              {isInvalid && (
                <FaExclamationTriangle className='text-base mr-1' />
              )}
              {data.name}
            </div>
            <Select
              className={clsx(
                'px-1 border-l',
                isInvalid
                  ? 'border-red-300 bg-red-300'
                  : 'border-stone-300 bg-stone-300'
              )}
              options={influenceTypes.map((infType) => ({
                key: infType,
                value: infType,
                label: capitalize(infType.toLowerCase()),
              }))}
              value={influence.influenceType ?? 'HISTORICAL'}
              onChange={(influenceType) =>
                onChange({ ...influence, influenceType })
              }
              tabIndex={-1}
            />
          </div>
        )
      }

      return (
        <div
          className='flex items-center px-2 py-0.5 text-sm font-medium'
          ref={setReferenceElement}
        >
          {isInvalid && <FaExclamationTriangle className='text-base mr-1' />}
          {data.name}
        </div>
      )
    }

    return <Loader className='px-2 py-0.5' />
  }, [data, influence, isInvalid, onChange])

  return (
    <>
      <div
        className={clsx(
          'flex border',
          isInvalid
            ? 'border-red-400 bg-red-200 text-red-600'
            : 'border-stone-400 bg-stone-200 text-stone-600'
        )}
      >
        {renderItem()}
        <button
          className={clsx(
            'border-l h-full px-1',
            isInvalid
              ? 'border-red-300 hover:bg-red-300'
              : 'border-stone-300 hover:bg-stone-300'
          )}
          type='button'
          onClick={() => onRemove()}
          tabIndex={-1}
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
          influences
        </Tooltip>
      )}
    </>
  )
}

export default InfluenceMultiselect
