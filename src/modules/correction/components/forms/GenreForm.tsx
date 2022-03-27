import { Dispatch, FC, SetStateAction } from 'react'

import ButtonPrimary from '../../../../common/components/ButtonPrimary'
import ButtonTertiary from '../../../../common/components/ButtonTertiary'
import Checkbox from '../../../../common/components/Checkbox'
import Input from '../../../../common/components/Input'
import Label from '../../../../common/components/Label'
import TextArea from '../../../../common/components/TextArea'
import { genreInfluencedByTypes } from '../../../../common/model/influences'
import { genreParentTypes } from '../../../../common/model/parents'
import { GenreApiInput } from '../../../server/routers/genres'
import GenreTypeSelect from './elements/GenreTypeSelect'
import InfluenceMultiselect from './elements/InfluenceMultiselect'
import LocationInput from './elements/LocationInput'
import MarkdownEditor from './elements/MarkdownEditor'
import ParentMultiselect from './elements/ParentMultiselect'
import StringArrayEditor from './elements/StringArrayEditor'

const smallLabelClassname = 'block text-xs font-medium text-stone-500'

const GenreForm: FC<{
  data: GenreApiInput
  onChange: Dispatch<SetStateAction<GenreApiInput>>
  onSubmit: () => void
  onCancel: () => void
  selfId?: number
}> = ({ data, onChange, onSubmit, onCancel, selfId }) => (
  <form
    className='space-y-2'
    onSubmit={(e) => {
      e.preventDefault()
      onSubmit()
    }}
  >
    <div className='flex items-start justify-between'>
      <div>
        <Label htmlFor='type'>Type</Label>
        <GenreTypeSelect
          id='type'
          value={data.type}
          onChange={(type) => onChange((d) => ({ ...d, type }))}
        />
      </div>
      <div className='flex items-center space-x-1'>
        <Label htmlFor='trial'>Trial</Label>
        <Checkbox
          id='trial'
          checked={data.trial}
          onChange={(e) => onChange((d) => ({ ...d, trial: e.target.checked }))}
        />
      </div>
    </div>
    <div>
      <Label htmlFor='name'>Name</Label>
      <Input
        id='name'
        value={data.name}
        onChange={(e) => onChange((d) => ({ ...d, name: e.target.value }))}
        required
        autoFocus
      />
    </div>
    <div>
      <Label htmlFor='alternate-names'>Alternate Names</Label>
      <label className={smallLabelClassname} htmlFor='alternate-names'>
        comma-separated list
      </label>
      <StringArrayEditor
        id='alternate-names'
        value={data.alternateNames}
        onChange={(alternateNames) =>
          onChange((d) => ({ ...d, alternateNames }))
        }
      />
    </div>
    {genreParentTypes[data.type].length > 0 && (
      <div>
        <Label htmlFor='parents'>Parents</Label>
        <ParentMultiselect
          id='parents'
          parents={data.parents}
          onChange={(parents) => onChange((d) => ({ ...d, parents }))}
          childType={data.type}
          selfId={selfId}
        />
      </div>
    )}
    {genreInfluencedByTypes[data.type].length > 0 && (
      <div>
        <Label htmlFor='influences'>Influences</Label>
        <InfluenceMultiselect
          id='influences'
          influences={data.influencedBy}
          onChange={(influencedBy) => onChange((d) => ({ ...d, influencedBy }))}
          childType={data.type}
          selfId={selfId}
        />
      </div>
    )}
    {data.type !== 'META' && (
      <>
        <div>
          <Label>Locations</Label>
          <LocationInput
            value={data.locations}
            onChange={(locations) => onChange((d) => ({ ...d, locations }))}
          />
        </div>
        <div>
          <Label htmlFor='cultures'>Cultures</Label>
          <label className={smallLabelClassname} htmlFor='cultures'>
            comma-separated list
          </label>
          <StringArrayEditor
            id='cultures'
            value={data.cultures}
            onChange={(cultures) => onChange((d) => ({ ...d, cultures }))}
          />
        </div>
      </>
    )}
    <div>
      <Label htmlFor='short-desc'>Short Description</Label>
      <TextArea
        id='short-desc'
        className='w-full'
        value={data.shortDesc ?? ''}
        onChange={(e) => onChange((d) => ({ ...d, shortDesc: e.target.value }))}
      />
    </div>
    <div>
      <Label htmlFor='long-desc'>Long Description</Label>
      <MarkdownEditor
        id='long-desc'
        value={data.longDesc ?? ''}
        onChange={(longDesc) => onChange((d) => ({ ...d, longDesc }))}
      />
    </div>
    <div className='space-x-1'>
      <ButtonPrimary type='submit'>Submit</ButtonPrimary>
      <ButtonTertiary type='button' onClick={() => onCancel()}>
        Cancel
      </ButtonTertiary>
    </div>
  </form>
)

export default GenreForm
