import { Dispatch, FC, SetStateAction } from 'react'

import { MetaInput } from '../../utils/create'
import FormElement from '../FormElement'
import GenreMultiselect from '../GenreMultiselect'
import SmallLabel from '../SmallLabel'

const MetaForm: FC<{
  selfId?: number
  data: MetaInput
  onChange: Dispatch<SetStateAction<MetaInput>>
}> = ({ selfId, data, onChange }) => (
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
        selfId={selfId}
        value={data.parentMetas}
        onChange={(parentMetas) => onChange((d) => ({ ...d, parentMetas }))}
        types={['meta']}
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

export default MetaForm
