import { useMemo } from 'react'

import { useWhoamiQuery } from '../../../common/services/auth'
import {
  CorrectionApiOutput,
  useSubmittedCorrectionsQuery,
} from '../../../common/services/corrections'
import { InferQueryOptions, TError } from '../../../common/utils/trpc'

const useAccountSubmittedCorrectionsQuery = (
  opts?: InferQueryOptions<'corrections.submitted'>
): {
  data?: CorrectionApiOutput[]
  error: TError | null
  isLoading: boolean
} => {
  const whoamiQuery = useWhoamiQuery()
  const submittedCorrectionsQuery = useSubmittedCorrectionsQuery(opts)

  const data = useMemo(() => {
    if (!whoamiQuery.data) return
    if (!submittedCorrectionsQuery.data) return

    const whoamiData = whoamiQuery.data
    if (whoamiData === 'LOGGED_OUT') return

    return submittedCorrectionsQuery.data.filter(
      (correction) => correction.creatorId === whoamiData.id
    )
  }, [submittedCorrectionsQuery.data, whoamiQuery.data])

  if (data) {
    return { data, error: null, isLoading: false }
  } else if (whoamiQuery.error || whoamiQuery.isLoading) {
    return { ...whoamiQuery, data: undefined }
  } else {
    return { ...submittedCorrectionsQuery, data: undefined }
  }
}

export default useAccountSubmittedCorrectionsQuery
