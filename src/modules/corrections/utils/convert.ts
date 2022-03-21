import { InferQueryOutput } from '../../../common/utils/trpc'
import { CorrectionGenreApiInputData } from '../services'

export const toCorrectionGenreApiInputData = (
  data: InferQueryOutput<'genres.byId'>
): CorrectionGenreApiInputData => ({
  type: data.type,
  name: data.name,
  alternateNames: data.alternateNames,
  shortDesc: data.shortDesc,
  longDesc: data.longDesc,
  parents: data.parents.map((id) => ({ id, type: 'exists' })),
  influencedBy: data.influencedBy.map(({ id, influenceType }) => ({
    id,
    influenceType,
    type: 'exists',
  })),
  locations: data.locations,
  cultures: data.cultures,
})

export const cleanUiData = (
  data: CorrectionGenreApiInputData
): CorrectionGenreApiInputData => ({
  ...data,
  alternateNames: data.alternateNames.filter((s) => s.length > 0),
  cultures: data.cultures.filter((s) => s.length > 0),
})
