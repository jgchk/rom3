import { Dispatch, FC, SetStateAction } from 'react'

import { isMetaParent } from '../../utils/types/metas'
import { isStyleParent, StyleUiState } from '../../utils/types/styles'
import FormElement from '../FormElement'
import InfluenceMultiselect from '../InfluenceMultiselect'
import LocationInput from '../LocationInput'
import ParentMultiselect from '../ParentMultiselect'
import SmallLabel from '../SmallLabel'

const StyleForm: FC<{
  data: StyleUiState
  onChange: Dispatch<SetStateAction<StyleUiState>>
}> = ({ data, onChange }) => (
  <>
    <FormElement>
      <label>Name *</label>
      <input
        value={data.name}
        onChange={(e) => onChange((d) => ({ ...d, name: e.target.value }))}
        required
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
      <label>Parents</label>
      <ParentMultiselect
        value={[...data.parentStyles, ...data.parentMetas]}
        onChange={(parents) =>
          onChange((d) => ({
            ...d,
            parentStyles: parents.filter(isStyleParent),
            parentMetas: parents.filter(isMetaParent),
          }))
        }
        types={['style', 'meta']}
      />
    </FormElement>
    <FormElement>
      <label>Influences</label>
      <InfluenceMultiselect
        value={data.influencedByStyles}
        onChange={(influencedByStyles) =>
          onChange((d) => ({ ...d, influencedByStyles }))
        }
        types={['style']}
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

export default StyleForm
