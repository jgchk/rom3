import { Dispatch, FC, SetStateAction } from 'react'

import { GenreApiInput } from '../../../server/routers/genres'
import MarkdownEditor from './elements/MarkdownEditor'
import ParentMultiselect from './elements/ParentMultiselect'
import StringArrayEditor from './elements/StringArrayEditor'

const MetaForm: FC<{
  data: GenreApiInput
  onChange: Dispatch<SetStateAction<GenreApiInput>>
}> = ({ data, onChange }) => (
  <>
    <div>
      <label className='block'>Name *</label>
      <input
        value={data.name}
        onChange={(e) => onChange((d) => ({ ...d, name: e.target.value }))}
        required
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
      <label className='block'>Parents</label>
      <ParentMultiselect
        parents={data.parents}
        onChange={(parents) => onChange((d) => ({ ...d, parents }))}
        childType='META'
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

export default MetaForm
