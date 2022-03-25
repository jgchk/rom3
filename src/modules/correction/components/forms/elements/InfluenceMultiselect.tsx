import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'

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
}> = ({ influence, onChange, onRemove }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data } = useCorrectionGenreQuery(influence.id, correctionId)

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
    <div className='flex space-x-2 items-center pl-2 bg-gray-200 border border-gray-300'>
      {renderItem()}
      <button
        className='border-l border-gray-300'
        type='button'
        onClick={() => onRemove()}
      >
        &#10005;
      </button>
    </div>
  )
}

export default InfluenceMultiselect
