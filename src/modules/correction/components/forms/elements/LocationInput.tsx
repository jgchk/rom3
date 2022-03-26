import clsx from 'clsx'
import { FC, useMemo } from 'react'
import { IoMdTrash } from 'react-icons/io'

import { InferMutationInput } from '../../../../../common/utils/trpc'
import { inputClass } from '../styles'

type LocationUiState = InferMutationInput<'genres.add'>['locations'][number]

const makeLocation = (): LocationUiState => ({
  city: '',
  region: '',
  country: '',
})

const LocationInput: FC<{
  value: LocationUiState[]
  onChange: (data: LocationUiState[]) => void
}> = ({ value: rawValue, onChange }) => {
  const value = useMemo(
    () => (rawValue.length === 0 ? [makeLocation()] : rawValue),
    [rawValue]
  )

  return (
    <div className='space-y-1'>
      {value.map((location, i) => (
        <div className='flex items-center space-x-1' key={i}>
          <input
            className={clsx(inputClass, 'flex-1 min-w-0')}
            placeholder='City'
            value={location.city}
            onChange={(e) =>
              onChange(
                value.map((loc, j) =>
                  j === i ? { ...loc, city: e.target.value } : loc
                )
              )
            }
          />
          <input
            className={clsx(inputClass, 'flex-1 min-w-0')}
            placeholder='Region'
            value={location.region}
            onChange={(e) =>
              onChange(
                value.map((loc, j) =>
                  j === i ? { ...loc, region: e.target.value } : loc
                )
              )
            }
          />
          <input
            className={clsx(inputClass, 'flex-1 min-w-0')}
            placeholder='Country'
            value={location.country}
            onChange={(e) =>
              onChange(
                value.map((loc, j) =>
                  j === i ? { ...loc, country: e.target.value } : loc
                )
              )
            }
          />
          <button
            className='w-8 h-8 flex items-center justify-center text-stone-500 hover:text-primary-600 focus:text-primary-600 hover:bg-primary-100 focus:outline-none border border-transparent focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
            type='button'
            onClick={() => onChange(value.filter((_, j) => j !== i))}
          >
            <IoMdTrash />
          </button>
        </div>
      ))}
      <button
        className='px-2 py-1 text-sm uppercase font-bold text-stone-500 hover:text-stone-600'
        type='button'
        onClick={() => onChange([...value, makeLocation()])}
      >
        Add New
      </button>
    </div>
  )
}

export default LocationInput
