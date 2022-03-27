import { Dispatch, FC, SetStateAction } from 'react'

import ButtonPrimary from '../../../../common/components/ButtonPrimary'
import ButtonTertiary from '../../../../common/components/ButtonTertiary'
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
    <div>
      <Label>Type</Label>
      <GenreTypeSelect
        value={data.type}
        onChange={(type) => onChange((d) => ({ ...d, type }))}
      />
    </div>
    <div>
      <Label>Name</Label>
      <Input
        value={data.name}
        onChange={(e) => onChange((d) => ({ ...d, name: e.target.value }))}
        required
        autoFocus
      />
    </div>
    <div>
      <Label>Alternate Names</Label>
      <label className={smallLabelClassname}>comma-separated list</label>
      <StringArrayEditor
        value={data.alternateNames}
        onChange={(alternateNames) =>
          onChange((d) => ({ ...d, alternateNames }))
        }
      />
    </div>
    {genreParentTypes[data.type].length > 0 && (
      <div>
        <Label>Parents</Label>
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
        <Label>Influences</Label>
        <InfluenceMultiselect
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
          <Label>Cultures</Label>
          <label className={smallLabelClassname}>comma-separated list</label>
          <StringArrayEditor
            value={data.cultures}
            onChange={(cultures) => onChange((d) => ({ ...d, cultures }))}
          />
        </div>
      </>
    )}
    <div>
      <Label>Short Description</Label>
      <TextArea
        className='w-full'
        value={data.shortDesc ?? ''}
        onChange={(e) => onChange((d) => ({ ...d, shortDesc: e.target.value }))}
      />
    </div>
    <div>
      <Label>Long Description</Label>
      <MarkdownEditor
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
