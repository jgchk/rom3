import { Dispatch, FC, SetStateAction } from 'react'

import { isMetaParent } from '../../utils/types/metas'
import { isStyleInfluence, isStyleParent } from '../../utils/types/styles'
import {
  isTrendInfluence,
  isTrendParent,
  TrendUiState,
} from '../../utils/types/trends'
import FormElement from '../FormElement'
import InfluenceMultiselect from '../InfluenceMultiselect'
import LocationInput from '../LocationInput'
import ParentMultiselect from '../ParentMultiselect'
import SmallLabel from '../SmallLabel'

const TrendForm: FC<{
  data: TrendUiState
  onChange: Dispatch<SetStateAction<TrendUiState>>
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
        value={[
          ...data.parentTrends,
          ...data.parentStyles,
          ...data.parentMetas,
        ]}
        onChange={(parents) =>
          onChange((d) => ({
            ...d,
            parentTrends: parents.filter(isTrendParent),
            parentStyles: parents.filter(isStyleParent),
            parentMetas: parents.filter(isMetaParent),
          }))
        }
        types={['trend', 'style', 'meta']}
      />
    </FormElement>
    <FormElement>
      <label>Influences</label>
      <InfluenceMultiselect
        value={[...data.influencedByTrends, ...data.influencedByStyles]}
        onChange={(influencedBy) =>
          onChange((d) => ({
            ...d,
            influencedByTrends: influencedBy.filter(isTrendInfluence),
            influencedByStyles: influencedBy.filter(isStyleInfluence),
          }))
        }
        types={['trend', 'style']}
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

export default TrendForm
