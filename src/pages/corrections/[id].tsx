import { NextPage } from 'next'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import { getFirstOrValue } from '../../common/utils/array'
import TreeView from '../../modules/view-correction/components/TreeView'

const ViewCorrectionPage: NextPage = () => {
  const router = useRouter()

  const id = useMemo(() => {
    const idStr = getFirstOrValue(router.query.id)
    if (idStr === undefined) return
    const id = Number.parseInt(idStr)
    if (Number.isNaN(id)) return
    return id
  }, [router.query.id])

  if (id === undefined) {
    return <ErrorPage statusCode={404} />
  }

  return <TreeView id={id} />
}

export default ViewCorrectionPage
