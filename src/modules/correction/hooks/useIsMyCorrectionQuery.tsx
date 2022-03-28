import { useMemo } from 'react'

import { useWhoamiQuery } from '../../../common/services/auth'
import { useCorrectionQuery } from '../../../common/services/corrections'
import { TError } from '../../../common/utils/trpc'

const useIsMyCorrectionQuery = (
  correctionId: number
): {
  data?: boolean
  error: TError | null
  isLoading: boolean
} => {
  const correctionQuery = useCorrectionQuery(correctionId)
  const whoamiQuery = useWhoamiQuery()

  const isMyCorrection = useMemo(() => {
    if (!correctionQuery.data) return
    if (!whoamiQuery.data) return

    if (whoamiQuery.data === 'LOGGED_OUT') return false

    return whoamiQuery.data.id === correctionQuery.data.creatorId
  }, [correctionQuery.data, whoamiQuery.data])

  if (isMyCorrection !== undefined) {
    return { data: isMyCorrection, error: null, isLoading: false }
  } else if (whoamiQuery.error || whoamiQuery.isLoading) {
    return { ...whoamiQuery, data: undefined }
  } else {
    return { ...correctionQuery, data: undefined }
  }
}

export default useIsMyCorrectionQuery
