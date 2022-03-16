import { Dispatch, FC, SetStateAction, useMemo } from 'react'

import trpc from '../../../../common/utils/trpc'
import { MetaInput, MetaObject } from '../../utils/create'
import FormElement from '../FormElement'
import Multiselect from '../Multiselect'
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
      <MetaMultiselect
        selfId={selfId}
        value={data.parentMetas}
        onChange={(parents) =>
          onChange((d) => ({ ...d, parentMetas: parents }))
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

const MetaMultiselect: FC<{
  selfId?: number
  value: MetaObject[]
  onChange: (selected: MetaObject[]) => void
}> = ({ selfId, value, onChange }) => {
  const { data, error, isLoading } = trpc.useQuery(['metas.all'])

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
        onChange(selected.map((s) => ({ ...s, type: 'meta' })))
      }
    />
  )
}

export default MetaForm
