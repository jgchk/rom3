import { GenreType } from '@prisma/client'

import { GenreApiInput } from '../../../common/services/genres'

export const makeUiData = (
  type: GenreType,
  parentId?: number
): GenreApiInput => ({
  type,
  name: '',
  alternateNames: [],
  shortDesc: '',
  longDesc: '',
  parents: parentId ? [parentId] : [],
  influencedBy: [],
  locations: [],
  cultures: [],
})

export const cleanUiData = (data: GenreApiInput): GenreApiInput => ({
  ...data,
  alternateNames: data.alternateNames.filter((s) => s.length > 0),
  cultures: data.cultures.filter((s) => s.length > 0),
})
