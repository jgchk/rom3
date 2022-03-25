import { Dispatch, FC, SetStateAction } from 'react'

import { GenreApiInput } from '../../../server/routers/genres'
import InfluenceMultiselect from './elements/InfluenceMultiselect'
import LocationInput from './elements/LocationInput'
import MarkdownEditor from './elements/MarkdownEditor'
import StringArrayEditor from './elements/StringArrayEditor'

const SceneForm: FC<{
  data: GenreApiInput
  onChange: Dispatch<SetStateAction<GenreApiInput>>
}> = ({ data, onChange }) => (
  <>
    <div>
      <label className='block'>Name *</label>
      <input
        className='border border-gray-300'
        value={data.name}
        onChange={(e) => onChange((d) => ({ ...d, name: e.target.value }))}
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
    <div>
      <label className='block'>Influences</label>
      <InfluenceMultiselect
        influences={data.influencedBy}
        onChange={(influencedBy) => onChange((d) => ({ ...d, influencedBy }))}
        childType='SCENE'
      />
    </div>
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
    <div>
      <label className='block'>Short Description *</label>
      <textarea
        className='border border-gray-300 w-full'
        value={data.shortDesc}
        onChange={(e) => onChange((d) => ({ ...d, shortDesc: e.target.value }))}
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
  </>
)

export default SceneForm
