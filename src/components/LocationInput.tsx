import { FC } from 'react'

type LocationInput = { city: string; region: string; country: string }

const LocationInput: FC<{
  value: LocationInput[]
  onChange: (data: LocationInput[]) => void
}> = ({ value, onChange }) => (
  <div>
    {value.map((location, i) => (
      <div key={i}>
        <input
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
      </div>
    ))}
    <button
      type='button'
      onClick={() =>
        onChange([...value, { city: '', region: '', country: '' }])
      }
    >
      +
    </button>
  </div>
)

export default LocationInput
