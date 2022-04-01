import { CorrectionApiOutput } from '../../../common/services/corrections'

export const compareUpdatedAt = (
  a: CorrectionApiOutput,
  b: CorrectionApiOutput
) => a.updatedAt.getMilliseconds() - b.updatedAt.getMilliseconds()
