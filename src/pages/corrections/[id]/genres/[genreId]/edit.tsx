import { NextPage } from 'next'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import { getFirstOrValue } from '../../../../../common/utils/array'
import EditView from '../../../../../modules/correction/components/EditView'
import Layout from '../../../../../modules/correction/components/Layout'

const Edit: NextPage = () => {
  const { query } = useRouter()

  const correctionId = useMemo(() => {
    const idStr = getFirstOrValue(query.id)
    if (idStr === undefined) return
    const id = Number.parseInt(idStr)
    if (Number.isNaN(id)) return
    return id
  }, [query.id])

  const genreId = useMemo(() => {
    const idStr = getFirstOrValue(query.genreId)
    if (idStr === undefined) return
    const id = Number.parseInt(idStr)
    if (Number.isNaN(id)) return
    return id
  }, [query.genreId])

  const from = useMemo(() => getFirstOrValue(query.from), [query.from])

  const deleteOnCancel = useMemo(
    () => getFirstOrValue(query.deleteOnCancel) === 'true',
    [query.deleteOnCancel]
  )

  if (correctionId === undefined || genreId === undefined) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout correctionId={correctionId}>
      <EditView genreId={genreId} from={from} deleteOnCancel={deleteOnCancel} />
    </Layout>
  )
}

export default Edit
