import { Dispatch, FC, SetStateAction, useMemo } from 'react'

import trpc from '../../../common/utils/trpc'
import { SceneInput, SceneObject } from '../utils/create'
import FormElement from './FormElement'
import LocationInput from './LocationInput'
import Multiselect from './Multiselect'
import SmallLabel from './SmallLabel'

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
      <SmallLabel>comma-separated list</SmallLabel>
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
      <label>Locations</label>
      <LocationInput
        value={data.locations}
        onChange={(locations) => onChange((d) => ({ ...d, locations }))}
      />
    </FormElement>
    <FormElement>
      <label>Cultures</label>
      <SmallLabel>comma-separated list</SmallLabel>
      <input
        value={data.cultures}
        onChange={(e) => onChange((d) => ({ ...d, cultures: e.target.value }))}
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
