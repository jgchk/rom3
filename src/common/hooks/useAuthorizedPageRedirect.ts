import { useRouter } from 'next/router'
import { useEffect } from 'react'

import useLoggedInQuery from './useLoggedInQuery'

const useAuthorizedPageRedirect = () => {
  const { asPath, push: navigate } = useRouter()

  const { data } = useLoggedInQuery()
  useEffect(() => {
    if (data === false) {
      void navigate({ pathname: '/login', query: { from: asPath } })
    }
  }, [asPath, data, navigate])
}

export default useAuthorizedPageRedirect
