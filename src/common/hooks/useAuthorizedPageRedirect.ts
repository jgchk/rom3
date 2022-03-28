import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useFromQueryParams } from './useFromQueryParam'
import useLoggedInQuery from './useLoggedInQuery'

const useAuthorizedPageRedirect = () => {
  const { push: navigate } = useRouter()

  const query = useFromQueryParams()

  const { data } = useLoggedInQuery()
  useEffect(() => {
    if (data === false) {
      void navigate({ pathname: '/login', query })
    }
  }, [data, navigate, query])
}

export default useAuthorizedPageRedirect
