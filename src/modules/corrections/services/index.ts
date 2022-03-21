import { GenreType } from '../../../common/model'
import trpc, { InferMutationInput } from '../../../common/utils/trpc'

export type CorrectionGenreApiInput =
  InferMutationInput<'corrections.add'>['create'][number]

export type CorrectionGenreApiInputData = CorrectionGenreApiInput['data']

export type CorrectionIdApiInput =
  CorrectionGenreApiInputData['parents'][number]

export type CorrectionIdApiInputType = CorrectionIdApiInput['type']

const correctionIdApiInputTypes: CorrectionIdApiInputType[] = [
  'created',
  'exists',
]

export const isCorrectionIdApiInputType = (
  s: string
): s is CorrectionIdApiInputType =>
  (correctionIdApiInputTypes as string[]).includes(s)

/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isCorrectionIdApiInput = (o: any): o is CorrectionIdApiInput =>
  typeof o === 'object' &&
  o !== null &&
  'type' in o &&
  typeof o.type === 'string' &&
  isCorrectionIdApiInputType(o.type) &&
  'id' in o &&
  typeof o.id === 'number'
/* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */

export const makeCorrectionGenreApiInputData = (
  type: GenreType,
  parentId?: CorrectionIdApiInput
): CorrectionGenreApiInputData => ({
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

export const useAddCorrectionMutation = () =>
  trpc.useMutation(['corrections.add'])
