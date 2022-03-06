import { Dispatch, FC, SetStateAction } from 'react'

import { SceneInput, SceneObject } from '../utils/create'
import trpc from '../utils/trpc'
import FormElement from './FormElement'
import Multiselect from './Multiselect'

const SceneForm: FC<{
  data: SceneInput
  onChange: Dispatch<SetStateAction<SceneInput>>
}> = ({ data, onChange }) => (
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
  </>
)

const InfluencedByDropdown: FC<{
  value: SceneObject[]
  onChange: (selected: SceneObject[]) => void
}> = ({ value, onChange }) => {
  const { data, error, isLoading } = trpc.useQuery(['scenes.all'])

  return (
    <Multiselect
      data={data}
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
