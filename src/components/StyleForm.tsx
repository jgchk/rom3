import { Dispatch, FC, SetStateAction, useMemo } from 'react'

import { StyleInput, StyleObject } from '../utils/create'
import trpc from '../utils/trpc'
import FormElement from './FormElement'
import Multiselect from './Multiselect'

const StyleForm: FC<{
  selfId?: number
  data: StyleInput
  onChange: Dispatch<SetStateAction<StyleInput>>
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
        selfId={selfId}
        value={data.parentStyles}
        onChange={(parentStyles) => onChange((d) => ({ ...d, parentStyles }))}
      />
    </FormElement>
    <FormElement>
      <label>Influences</label>
      <StyleMultiselect
        selfId={selfId}
        value={data.influencedByStyles}
        onChange={(influencedByStyles) =>
          onChange((d) => ({ ...d, influencedByStyles }))
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

const StyleMultiselect: FC<{
  selfId?: number
  value: StyleObject[]
  onChange: (selected: StyleObject[]) => void
}> = ({ selfId, value, onChange }) => {
  const { data, error, isLoading } = trpc.useQuery(['styles.all'])

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
        onChange(selected.map((s) => ({ ...s, type: 'style' })))
      }
    />
  )
}

export default StyleForm
