import { NextPage } from 'next'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import ClientOnly from '../../../../common/components/ClientOnly'
import { getFirstOrValue } from '../../../../common/utils/array'
import Layout from '../../../../modules/correction/components/Layout'
import ListView from '../../../../modules/correction/components/ListView'

const Home: NextPage = () => {
  const router = useRouter()

  const correctionId = useMemo(() => {
    const idStr = getFirstOrValue(router.query.id)
    if (idStr === undefined) return
    const id = Number.parseInt(idStr)
    if (Number.isNaN(id)) return
    return id
  }, [router.query.id])

  if (correctionId === undefined) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout correctionId={correctionId}>
      <ClientOnly>
        <ListView />
      </ClientOnly>
    </Layout>
  )
}

export default Home
