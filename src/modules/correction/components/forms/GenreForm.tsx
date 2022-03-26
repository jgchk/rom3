import { Dispatch, FC, SetStateAction } from 'react'

import { genreInfluencedByTypes } from '../../../../common/model/influences'
import { genreParentTypes } from '../../../../common/model/parents'
import { GenreApiInput } from '../../../server/routers/genres'
import GenreTypeSelect from './elements/GenreTypeSelect'
import InfluenceMultiselect from './elements/InfluenceMultiselect'
import LocationInput from './elements/LocationInput'
import MarkdownEditor from './elements/MarkdownEditor'
import ParentMultiselect from './elements/ParentMultiselect'
import StringArrayEditor from './elements/StringArrayEditor'

const GenreForm: FC<{
  data: GenreApiInput
  onChange: Dispatch<SetStateAction<GenreApiInput>>
  selfId?: number
}> = ({ data, onChange, selfId }) => {
  return (
    <div className='space-y-2'>
      <div>
        <label className='block'>Type</label>
        <GenreTypeSelect
          value={data.type}
          onChange={(type) => onChange((d) => ({ ...d, type }))}
        />
      </div>
      <div>
        <label className='block'>Name *</label>
        <input
          className='border border-gray-300 px-2 py-1'
          value={data.name}
          onChange={(e) => onChange((d) => ({ ...d, name: e.target.value }))}
          required
          autoFocus
        />
      </div>
      <div>
        <label className='block'>Alternate Names</label>
        <label className='block text-sm text-gray-800'>
          comma-separated list
        </label>
        <StringArrayEditor
          value={data.alternateNames}
          onChange={(alternateNames) =>
            onChange((d) => ({ ...d, alternateNames }))
          }
        />
      </div>
      {genreParentTypes[data.type].length > 0 && (
        <div>
          <label className='block'>Parents</label>
          <ParentMultiselect
            parents={data.parents}
            onChange={(parents) => onChange((d) => ({ ...d, parents }))}
            childType={data.type}
            selfId={selfId}
          />
        </div>
      )}
      {genreInfluencedByTypes[data.type].length > 0 && (
        <div>
          <label className='block'>Influences</label>
          <InfluenceMultiselect
            influences={data.influencedBy}
            onChange={(influencedBy) =>
              onChange((d) => ({ ...d, influencedBy }))
            }
            childType={data.type}
            selfId={selfId}
          />
        </div>
      )}
      {data.type !== 'META' && (
        <>
          <div>
            <label className='block'>Locations</label>
            <LocationInput
              value={data.locations}
              onChange={(locations) => onChange((d) => ({ ...d, locations }))}
            />
          </div>
          <div>
            <label className='block'>Cultures</label>
            <label className='block text-sm text-gray-800'>
              comma-separated list
            </label>
            <StringArrayEditor
              value={data.cultures}
              onChange={(cultures) => onChange((d) => ({ ...d, cultures }))}
            />
          </div>
        </>
      )}
      <div>
        <label className='block'>Short Description *</label>
        <textarea
          className='border border-gray-300 w-full px-2 py-1'
          value={data.shortDesc}
          onChange={(e) =>
            onChange((d) => ({ ...d, shortDesc: e.target.value }))
          }
          required
        />
      </div>
      <div>
        <label className='block'>Long Description *</label>
        <MarkdownEditor
          value={data.longDesc}
          onChange={(longDesc) => onChange((d) => ({ ...d, longDesc }))}
        />
      </div>
    </div>
  )
}

export default GenreForm
