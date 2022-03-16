import { Dispatch, FC, SetStateAction } from 'react'

import { isSimpleMetaOutput } from '../../utils/types/metas'
import { isSimpleStyleOutput } from '../../utils/types/styles'
import { isSimpleTrendOutput, TrendUiState } from '../../utils/types/trends'
import FormElement from '../FormElement'
import GenreMultiselect from '../GenreMultiselect'
import LocationInput from '../LocationInput'
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
      <GenreMultiselect
        value={[
          ...data.parentTrends,
          ...data.parentStyles,
          ...data.parentMetas,
        ]}
        onChange={(parents) =>
          onChange((d) => ({
            ...d,
            parentTrends: parents.filter(isSimpleTrendOutput),
            parentStyles: parents.filter(isSimpleStyleOutput),
            parentMetas: parents.filter(isSimpleMetaOutput),
          }))
        }
        types={['trend', 'style', 'meta']}
      />
    </FormElement>
    <FormElement>
      <label>Influences</label>
      <GenreMultiselect
        value={[...data.influencedByTrends, ...data.influencedByStyles]}
        onChange={(influencedBy) =>
          onChange((d) => ({
            ...d,
            influencedByTrends: influencedBy.filter(isSimpleTrendOutput),
            influencedByStyles: influencedBy.filter(isSimpleStyleOutput),
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
