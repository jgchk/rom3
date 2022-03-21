import { CorrectionIdApiInput, isCorrectionIdApiInputType } from '../services'

export const toCorrectionIdApiInputKey = (id: CorrectionIdApiInput) =>
  `${id.id}_${id.type}`

export const fromCorrectionIdApiInputKey = (
  key: string
): CorrectionIdApiInput => {
  const [id, type] = key.split('_')
  if (!isCorrectionIdApiInputType(type))
    throw new Error(`${type} is not a valid CorrectionIdApiInputType`)
  return { id: Number.parseInt(id), type }
}
