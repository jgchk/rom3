import clsx from 'clsx'
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'
import { RiArrowDownSLine, RiArrowUpSLine, RiCloseFill } from 'react-icons/ri'

import Tooltip from '../../../../../common/components/Tooltip'
import { GenreType } from '../../../../../common/model'
import { useCorrectionContext } from '../../../contexts/CorrectionContext'
import useCorrectionGenreQuery from '../../../hooks/useCorrectionGenreQuery'
import useCorrectionGenresQuery from '../../../hooks/useCorrectionGenresQuery'

const ParentMultiselect: FC<{
  id?: string
  parents: number[]
  onChange: (value: number[]) => void
  selectableTypes: GenreType[]
  selfId?: number
  renderTooltip: (selectedType?: GenreType) => ReactNode
}> = ({ id, parents, onChange, selectableTypes, selfId, renderTooltip }) => {
  const { id: correctionId } = useCorrectionContext()

  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)

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
          selectableTypes.includes(item.type) &&
          (selfId !== undefined ? selfId !== item.id : true) &&
          !parents.includes(item.id) &&
          item.name.toLowerCase().includes(inputValue.toLowerCase())
      ),
    [data, inputValue, parents, selectableTypes, selfId]
  )

  const renderOptions = useCallback(() => {
    if (!options)
      return <div className='px-2 py-1 text-sm text-stone-700'>Loading...</div>

    if (options.length === 0)
      return <div className='px-2 py-1 text-sm text-stone-700'>No items</div>

    return options.map((item) => (
      <li className='group hover:bg-stone-100' key={item.id}>
        <button
          className='w-full text-left text-sm text-stone-700 px-2 py-1 border-b border-stone-200 group-last:border-0'
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
      <div className='flex bg-white shadow-sm border border-stone-300 focus-within:border-primary-500 ring-0 focus-within:ring-1 focus-within:ring-primary-500 transition'>
        <div className='flex-1 flex flex-wrap gap-1 w-full p-1'>
          {parents.map((selectedItem) => (
            <SelectedItem
              key={selectedItem}
              id={selectedItem}
              onRemove={() => removeParent(selectedItem)}
              selectableTypes={selectableTypes}
              renderTooltip={renderTooltip}
            />
          ))}
          <input
            id={id}
            className='flex-1 border border-transparent focus:outline-none'
            placeholder='Search...'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setOpen(true)}
          />
        </div>
        <button
          className='px-1 border-l text-stone-400 border-stone-200 hover:bg-stone-100'
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
        <ul
          className='absolute z-10 w-full bg-white border border-stone-300 shadow'
          style={{ top: 'calc(100% - 1px)' }}
        >
          {renderOptions()}
        </ul>
      )}
    </div>
  )
}

const SelectedItem: FC<{
  id: number
  onRemove: () => void
  selectableTypes: GenreType[]
  renderTooltip: (selectedType?: GenreType) => ReactNode
}> = ({ id, onRemove, selectableTypes, renderTooltip }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data } = useCorrectionGenreQuery(id, correctionId)

  const isInvalid = useMemo(() => {
    if (!data) return false
    return !selectableTypes.includes(data.type)
  }, [data, selectableTypes])

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
            : 'border-stone-400 bg-stone-200 text-stone-600'
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
              : 'border-stone-300 hover:bg-stone-300'
          )}
          type='button'
          onClick={() => onRemove()}
        >
          <RiCloseFill />
        </button>
      </div>

      {isInvalid && (
        <Tooltip referenceElement={referenceElement}>
          {renderTooltip(data?.type)}
        </Tooltip>
      )}
    </>
  )
}

export default ParentMultiselect
