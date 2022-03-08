import { Dispatch, FC, SetStateAction, useMemo } from 'react'

import {
  isStyle,
  isTrend,
  StyleObject,
  TrendInput,
  TrendObject,
} from '../utils/create'
import trpc, { InferQueryOutput } from '../utils/trpc'
import FormElement from './FormElement'
import LocationInput from './LocationInput'
import Multiselect from './Multiselect'

type Output = InferQueryOutput<'genres'>[number]
const isStyleOrTrend = (o: Output): o is StyleObject | TrendObject =>
  o.type === 'style' || o.type === 'trend'

const TrendForm: FC<{
  selfId?: number
  data: TrendInput
  onChange: Dispatch<SetStateAction<TrendInput>>
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
      <StyleOrTrendMultiselect
        selfId={selfId}
        value={[...data.parentTrends, ...data.parentStyles]}
        onChange={(parents) =>
          onChange((d) => ({
            ...d,
            parentTrends: parents.filter(isTrend),
            parentStyles: parents.filter(isStyle),
          }))
        }
      />
    </FormElement>
    <FormElement>
      <label>Influences</label>
      <StyleOrTrendMultiselect
        selfId={selfId}
        value={[...data.influencedByTrends, ...data.influencedByStyles]}
        onChange={(influencedBy) =>
          onChange((d) => ({
            ...d,
            influencedByTrends: influencedBy.filter(isTrend),
            influencedByStyles: influencedBy.filter(isStyle),
          }))
        }
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

const StyleOrTrendMultiselect: FC<{
  selfId?: number
  value: (TrendObject | StyleObject)[]
  onChange: (value: (TrendObject | StyleObject)[]) => void
}> = ({ selfId, value, onChange }) => {
  const { data, error, isLoading } = trpc.useQuery([
    'genres',
    { type: ['style', 'trend'] },
  ])

  const dataWithoutSelf = useMemo(
    () =>
      selfId === undefined
        ? data
        : data?.filter(
            (item) => !(item.type === 'trend' && item.id === selfId)
          ),
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
      onChange={(selected) => onChange(selected.filter(isStyleOrTrend))}
    />
  )
}

export default TrendForm
