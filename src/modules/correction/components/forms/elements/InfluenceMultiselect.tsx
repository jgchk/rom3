import clsx from 'clsx'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'
import { RiArrowDownSLine, RiArrowUpSLine, RiCloseFill } from 'react-icons/ri'

import Select from '../../../../../common/components/Select'
import Tooltip from '../../../../../common/components/Tooltip'
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

const InfluenceMultiselect: FC<{
  influences: InfluenceUiState[]
  onChange: (value: InfluenceUiState[]) => void
  childType: GenreType
  selfId?: number
}> = ({ influences, onChange, childType, selfId }) => {
  const { id: correctionId } = useCorrectionContext()

  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)

  const influencedByTypes = useMemo(
    () => genreInfluencedByTypes[childType],
    [childType]
  )

  const addInfluence = useCallback(
    (add: InfluenceUiState) => onChange([...influences, add]),
    [onChange, influences]
  )

  const removeInfluence = useCallback(
    (remove: InfluenceUiState) =>
      onChange(influences.filter((item) => item.id !== remove.id)),
    [onChange, influences]
  )

  const updateInfluence = useCallback(
    (update: InfluenceUiState) =>
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
      data?.filter(
        (item) =>
          influencedByTypes.includes(item.type) &&
          (selfId !== undefined ? selfId !== item.id : true) &&
          !influences.some(
            (selectedInfluence) => item.id === selectedInfluence.id
          ) &&
          item.name.toLowerCase().startsWith(inputValue.toLowerCase())
      ),
    [data, influencedByTypes, selfId, influences, inputValue]
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
            addInfluence({ id: item.id, influenceType: 'HISTORICAL' })
            setInputValue('')
          }}
        >
          {item.name}
        </button>
      </li>
    ))
  }, [addInfluence, options])

  return (
    <div className='relative' ref={containerRef}>
      <div className='flex border border-gray-300'>
        <div className='flex-1 flex flex-wrap gap-1 w-full p-1'>
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

const SelectedInfluence: FC<{
  influence: InfluenceUiState
  onChange: (value: InfluenceUiState) => void
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
                  : 'border-gray-300 bg-gray-300'
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

    return <div className='px-2 py-0.5 text-sm font-medium'>Loading...</div>
  }, [data, influence, isInvalid, onChange])

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
        {renderItem()}
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
          influences
        </Tooltip>
      )}
    </>
  )
}

export default InfluenceMultiselect
