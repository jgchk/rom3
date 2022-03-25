import clsx from 'clsx'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RiCloseFill } from 'react-icons/ri'

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
    if (!options) return <div>Loading...</div>
    if (options.length === 0) return <div>No items</div>
    return options.map((item) => (
      <li key={item.id}>
        <button
          className='w-full text-left'
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
      <div className='flex space-x-1 w-full border border-gray-300'>
        {influences.length > 0 && (
          <div className='flex space-x-1 p-1'>
            {influences.map((selectedItem) => (
              <SelectedInfluence
                key={`${selectedItem.id}_${selectedItem.influenceType ?? ''}`}
                influence={selectedItem}
                onChange={(update) => updateInfluence(update)}
                onRemove={() => removeInfluence(selectedItem)}
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
    <div
      className={clsx(
        'flex border',
        isInvalid
          ? 'border-red-400 bg-red-200 text-red-600'
          : 'border-gray-400 bg-gray-200 text-gray-600'
      )}
    >
      <div className='px-2 py-0.5 text-sm font-medium'>{renderItem()}</div>
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

export default InfluenceMultiselect
