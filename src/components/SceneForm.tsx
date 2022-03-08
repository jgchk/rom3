import { Dispatch, FC, SetStateAction, useMemo } from 'react'

import { SceneInput, SceneObject } from '../utils/create'
import trpc from '../utils/trpc'
import FormElement from './FormElement'
import Multiselect from './Multiselect'

const SceneForm: FC<{
  selfId?: number
  data: SceneInput
  onChange: Dispatch<SetStateAction<SceneInput>>
}> = ({ selfId, data, onChange }) => (
  <>
    <FormElement>
      <label>Name *</label>
      <input
        value={data.name}
        onChange={(e) => onChange((d) => ({ ...d, name: e.target.value }))}
      />
    </FormElement>
    <FormElement>
      <label>Alternate Names</label>
      <input
        value={data.alternateNames}
        onChange={(e) =>
          onChange((d) => ({ ...d, alternateNames: e.target.value }))
        }
      />
    </FormElement>
    <FormElement>
      <label>Influences</label>
      <InfluencedByDropdown
        selfId={selfId}
        value={data.influencedByScenes}
        onChange={(influencedByScenes) =>
          onChange((d) => ({ ...d, influencedByScenes }))
        }
      />
    </FormElement>
    <FormElement>
      <label>Short Description *</label>
      <textarea
        value={data.shortDesc}
        onChange={(e) => onChange((d) => ({ ...d, shortDesc: e.target.value }))}
        style={{ width: '100%' }}
        required
      />
    </FormElement>
    <FormElement>
      <label>Long Description *</label>
      <textarea
        value={data.longDesc}
        onChange={(e) => onChange((d) => ({ ...d, longDesc: e.target.value }))}
        style={{ width: '100%', height: 300 }}
        required
      />
    </FormElement>
    <FormElement>
      <label>Locations</label>
      {data.locations.map((location, i) => (
        <div key={i}>
          <input
            placeholder='City'
            value={location.city}
            onChange={(e) =>
              onChange((d) => ({
                ...d,
                locations: d.locations.map((loc, j) =>
                  j === i ? { ...loc, city: e.target.value } : loc
                ),
              }))
            }
          />
          <input
            placeholder='Region'
            value={location.region}
            onChange={(e) =>
              onChange((d) => ({
                ...d,
                locations: d.locations.map((loc, j) =>
                  j === i ? { ...loc, region: e.target.value } : loc
                ),
              }))
            }
          />
          <input
            placeholder='Country'
            value={location.country}
            onChange={(e) =>
              onChange((d) => ({
                ...d,
                locations: d.locations.map((loc, j) =>
                  j === i ? { ...loc, country: e.target.value } : loc
                ),
              }))
            }
          />
          <button
            type='button'
            onClick={() =>
              onChange((d) => ({
                ...d,
                locations: d.locations.filter((_, j) => j !== i),
              }))
            }
          >
            -
          </button>
        </div>
      ))}
      <button
        type='button'
        onClick={() =>
          onChange((d) => ({
            ...d,
            locations: [...d.locations, { city: '', region: '', country: '' }],
          }))
        }
      >
        +
      </button>
    </FormElement>
  </>
)

const InfluencedByDropdown: FC<{
  selfId?: number
  value: SceneObject[]
  onChange: (selected: SceneObject[]) => void
}> = ({ selfId, value, onChange }) => {
  const { data, error, isLoading } = trpc.useQuery(['scenes.all'])

  const dataWithoutSelf = useMemo(
    () =>
      selfId === undefined ? data : data?.filter((item) => item.id !== selfId),
    [data, selfId]
  )

  return (
    <Multiselect
      data={dataWithoutSelf}
      error={error}
      isLoading={isLoading}
      filter={(item, query) =>
        item.name.toLowerCase().startsWith(query.toLowerCase())
      }
      itemDisplay={(item) => item.name}
      itemKey={(item) => item.id}
      selected={value}
      onChange={(selected) =>
        onChange(selected.map((s) => ({ ...s, type: 'scene' })))
      }
    />
  )
}

export default SceneForm
