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
