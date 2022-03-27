import { useMemo } from 'react'

import { useWhoamiQuery } from '../services/auth'

const useLoggedInQuery = () => {
  const query = useWhoamiQuery()
  const data = useMemo(() => {
    if (query.data === undefined) return
    return query.data !== 'LOGGED_OUT'
  }, [query.data])
  return { ...query, data }
}

export default useLoggedInQuery
