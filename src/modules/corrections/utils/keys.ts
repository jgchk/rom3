import { CorrectionIdApiInput } from '../services'

export const getCorrectionIdApiInputKey = (id: CorrectionIdApiInput) =>
  `${id.id}_${id.type}`
