import { NextPage } from 'next'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import { isGenreType } from '../../../../common/model'
import { getFirstOrValue } from '../../../../common/utils/array'
import CreateView from '../../../../modules/correction/components/CreateView'
import Layout from '../../../../modules/correction/components/Layout'

const Create: NextPage = () => {
  const router = useRouter()

  const correctionId = useMemo(() => {
    const idStr = getFirstOrValue(router.query.id)
    if (idStr === undefined) return
    const id = Number.parseInt(idStr)
    if (Number.isNaN(id)) return
    return id
  }, [router.query.id])

  const type = useMemo(() => {
    const type = getFirstOrValue(router.query.type)
    if (type && isGenreType(type)) return type
  }, [router.query.type])

  const parentId = useMemo(() => {
    const idStr = getFirstOrValue(router.query.parentId)
    if (idStr === undefined) return
    const id = Number.parseInt(idStr)
    if (Number.isNaN(id)) return
    return id
  }, [router.query.parentId])

  if (correctionId === undefined) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout correctionId={correctionId}>
      <CreateView type={type} parentId={parentId} />
    </Layout>
  )
}

export default Create
