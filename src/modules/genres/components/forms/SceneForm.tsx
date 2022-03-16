import { Dispatch, FC, SetStateAction } from 'react'

import { SceneUiState } from '../../utils/types/scenes'
import FormElement from '../FormElement'
import GenreMultiselect from '../GenreMultiselect'
import LocationInput from '../LocationInput'
import SmallLabel from '../SmallLabel'

const SceneForm: FC<{
  data: SceneUiState
  onChange: Dispatch<SetStateAction<SceneUiState>>
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
      <GenreMultiselect
        value={data.influencedByScenes}
        onChange={(influencedByScenes) =>
          onChange((d) => ({ ...d, influencedByScenes }))
        }
        types={['scene']}
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

export default SceneForm
