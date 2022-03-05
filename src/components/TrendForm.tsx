import { Dispatch, FC, SetStateAction } from 'react'

import { StyleObject, TrendInput, TrendObject } from '../pages/create'
import trpc, { InferQueryOutput } from '../utils/trpc'
import FormElement from './FormElement'
import Multiselect from './Multiselect'

type Output = InferQueryOutput<'genres'>[number]
const isStyleOrTrend = (o: Output): o is StyleObject | TrendObject =>
  o.type === 'style' || o.type === 'trend'

const TrendForm: FC<{
  data: TrendInput
  onChange: Dispatch<SetStateAction<TrendInput>>
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
      <label>Influences</label>
      <InfluencedByDropdown
        value={[...data.styleInfluencedBy, ...data.trendInfluencedBy]}
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

const InfluencedByDropdown: FC<{
  value: (TrendObject | StyleObject)[]
  onChange: (value: (TrendObject | StyleObject)[]) => void
}> = ({ value, onChange }) => {
  const { data, error, isLoading } = trpc.useQuery([
    'genres',
    { type: ['style', 'trend'] },
  ])

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
      onChange={(selected) => onChange(selected.filter(isStyleOrTrend))}
    />
  )
}

export default TrendForm
