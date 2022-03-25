import { FC, useMemo } from 'react'

import { InferMutationInput } from '../../../../../common/utils/trpc'

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
    <div>
      {value.map((location, i) => (
        <div className='flex space-x-1' key={i}>
          <input
            className='flex-1'
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
            className='flex-1'
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
            className='flex-1'
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
            type='button'
            onClick={() => onChange(value.filter((_, j) => j !== i))}
          >
            -
          </button>
          <button
            type='button'
            onClick={() => {
              onChange([
                ...value.slice(0, i + 1),
                makeLocation(),
                ...value.slice(i + 1),
              ])
            }}
          >
            +
          </button>
        </div>
      ))}
    </div>
  )
}

export default LocationInput
