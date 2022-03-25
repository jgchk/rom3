import { Dispatch, FC, SetStateAction } from 'react'

import { GenreApiInput } from '../../../server/routers/genres'
import InfluenceMultiselect from './elements/InfluenceMultiselect'
import LocationInput from './elements/LocationInput'
import MarkdownEditor from './elements/MarkdownEditor'
import ParentMultiselect from './elements/ParentMultiselect'
import SmallLabel from './elements/SmallLabel'
import StringArrayEditor from './elements/StringArrayEditor'

const StyleForm: FC<{
  data: GenreApiInput
  onChange: Dispatch<SetStateAction<GenreApiInput>>
}> = ({ data, onChange }) => (
  <>
    <div>
      <label className='block'>Name *</label>
      <input
        value={data.name}
        onChange={(e) => onChange((d) => ({ ...d, name: e.target.value }))}
      />
    </div>
    <div>
      <label className='block'>Alternate Names</label>
      <SmallLabel className='block'>comma-separated list</SmallLabel>
      <StringArrayEditor
        value={data.alternateNames}
        onChange={(alternateNames) =>
          onChange((d) => ({ ...d, alternateNames }))
        }
      />
    </div>
    <div>
      <label className='block'>Parents</label>
      <ParentMultiselect
        parents={data.parents}
        onChange={(parents) => onChange((d) => ({ ...d, parents }))}
        childType='STYLE'
      />
    </div>
    <div>
      <label className='block'>Influences</label>
      <InfluenceMultiselect
        influences={data.influencedBy}
        onChange={(influencedBy) => onChange((d) => ({ ...d, influencedBy }))}
        childType='STYLE'
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
      <SmallLabel className='block'>comma-separated list</SmallLabel>
      <StringArrayEditor
        value={data.cultures}
        onChange={(cultures) => onChange((d) => ({ ...d, cultures }))}
      />
    </div>
    <div>
      <label className='block'>Short Description *</label>
      <textarea
        value={data.shortDesc}
        onChange={(e) => onChange((d) => ({ ...d, shortDesc: e.target.value }))}
        style={{ width: '100%' }}
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

export default StyleForm
