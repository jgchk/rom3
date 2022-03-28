import { useRouter } from 'next/router'
import { useMemo } from 'react'

export const useFromQueryParam = () => {
  const { asPath, query } = useRouter()

  return useMemo(() => {
    const from = query.from ?? asPath
    return from === '/login' || from === '/register' ? undefined : from
  }, [asPath, query.from])
}

export const useFromQueryParams = () => {
  const from = useFromQueryParam()

  const params = useMemo(() => (from ? { from } : {}), [from])

  return params
}
