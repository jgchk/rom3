import styled from '@emotion/styled'
import { FC } from 'react'

import {
  LocationInput as LocationInputType,
  makeLocation,
} from '../utils/create'

const LocationInput: FC<{
  value: LocationInputType[]
  onChange: (data: LocationInputType[]) => void
}> = ({ value, onChange }) => (
  <div>
    {value.map((location, i) => (
      <Container key={i}>
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
          onClick={() => {
            let val = value.filter((_, j) => j !== i)
            if (val.length === 0) val = [makeLocation()]
            onChange(val)
          }}
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
      </Container>
    ))}
  </div>
)

export default LocationInput

const Container = styled.div`
  display: flex;
  gap: 2px;

  input {
    flex: 1;
    min-width: 0;
  }
`
