import { Dispatch, FC, SetStateAction } from 'react'

import { StyleInput, StyleObject } from '../utils/create'
import trpc from '../utils/trpc'
import FormElement from './FormElement'
import Multiselect from './Multiselect'

const StyleForm: FC<{
  data: StyleInput
  onChange: Dispatch<SetStateAction<StyleInput>>
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
      <input
        value={data.alternateNames}
        onChange={(e) =>
          onChange((d) => ({ ...d, alternateNames: e.target.value }))
        }
      />
    </FormElement>
    <FormElement>
      <label>Parents</label>
      <StyleMultiselect
        value={data.parents}
        onChange={(parents) => onChange((d) => ({ ...d, parents }))}
      />
    </FormElement>
    <FormElement>
      <label>Influences</label>
      <StyleMultiselect
        value={data.influencedBy}
        onChange={(influencedBy) => onChange((d) => ({ ...d, influencedBy }))}
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

const StyleMultiselect: FC<{
  value: StyleObject[]
  onChange: (selected: StyleObject[]) => void
}> = ({ value, onChange }) => {
  const { data, error, isLoading } = trpc.useQuery(['styles.all'])

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
        onChange(selected.map((s) => ({ ...s, type: 'style' })))
      }
    />
  )
}

export default StyleForm
