import { NextPage } from 'next'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import { isGenreType } from '../../../../common/model'
import { getFirstOrValue } from '../../../../common/utils/array'
import CreateView from '../../../../modules/correction/components/CreateView'
import Layout from '../../../../modules/correction/components/Layout'

const Create: NextPage = () => {
  const { query } = useRouter()

  const correctionId = useMemo(() => {
    const idStr = getFirstOrValue(query.id)
    if (idStr === undefined) return
    const id = Number.parseInt(idStr)
    if (Number.isNaN(id)) return
    return id
  }, [query.id])

  const type = useMemo(() => {
    const type = getFirstOrValue(query.type)
    if (type && isGenreType(type)) return type
  }, [query.type])

  const parentId = useMemo(() => {
    const idStr = getFirstOrValue(query.parentId)
    if (idStr === undefined) return
    const id = Number.parseInt(idStr)
    if (Number.isNaN(id)) return
    return id
  }, [query.parentId])

  const from = useMemo(() => getFirstOrValue(query.from), [query.from])

  if (correctionId === undefined) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout correctionId={correctionId}>
      <CreateView type={type} parentId={parentId} from={from} />
    </Layout>
  )
}

export default Create
