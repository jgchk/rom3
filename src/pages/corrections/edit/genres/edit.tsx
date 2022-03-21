import { NextPage } from 'next'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import ClientOnly from '../../../../common/components/ClientOnly'
import { getFirstOrValue } from '../../../../common/utils/array'
import EditView from '../../../../modules/corrections/components/EditView'
import Layout from '../../../../modules/corrections/components/Layout'
import { fromCorrectionIdApiInputKey } from '../../../../modules/corrections/utils/keys'

const Create: NextPage = () => {
  const router = useRouter()

  const id = useMemo(() => {
    const idStr = getFirstOrValue(router.query.key)
    if (idStr !== undefined) return fromCorrectionIdApiInputKey(idStr)
  }, [router.query.key])

  if (id === undefined) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout>
      <ClientOnly>
        <EditView id={id} />
      </ClientOnly>
    </Layout>
  )
}

export default Create
