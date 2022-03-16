import { Dispatch, FC, SetStateAction, useMemo } from 'react'

import trpc, { InferQueryOutput } from '../../../../common/utils/trpc'
import {
  isStyle,
  isTrend,
  MetaObject,
  StyleObject,
  TrendInput,
  TrendObject,
} from '../../utils/create'
import FormElement from '../FormElement'
import LocationInput from '../LocationInput'
import Multiselect from '../Multiselect'
import SmallLabel from '../SmallLabel'

type Output = InferQueryOutput<'genres'>[number]

type TrendParent = StyleObject | TrendObject | MetaObject
const isTrendParent = (o: Output): o is TrendParent =>
  o.type === 'style' || o.type === 'trend' || o.type === 'meta'

type TrendInfluence = StyleObject | TrendObject
const isTrendInfluence = (o: Output): o is TrendInfluence =>
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
      <TrendParentMultiselect
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
      <TrendInfluenceMultiselect
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

// TODO: find a higher-level abstraction to combine Parent & Influence multiselects into one component
const TrendParentMultiselect: FC<{
  selfId?: number
  value: TrendParent[]
  onChange: (value: TrendParent[]) => void
}> = ({ selfId, value, onChange }) => {
  const { data, error, isLoading } = trpc.useQuery([
    'genres',
    { type: ['style', 'trend', 'meta'] },
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
      onChange={(selected) => onChange(selected.filter(isTrendParent))}
    />
  )
}

const TrendInfluenceMultiselect: FC<{
  selfId?: number
  value: TrendInfluence[]
  onChange: (value: TrendInfluence[]) => void
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
      onChange={(selected) => onChange(selected.filter(isTrendInfluence))}
    />
  )
}

export default TrendForm
