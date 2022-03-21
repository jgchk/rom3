import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import ClientOnly from '../common/components/ClientOnly'
import { isGenreType } from '../common/model'
import { getFirstOrValue } from '../common/utils/array'
import CreateView from '../modules/corrections/components/CreateView'
import { fromCorrectionIdApiInputKey } from '../modules/corrections/utils/keys'

const Create: NextPage = () => {
  const router = useRouter()

  const type = useMemo(() => {
    const type = getFirstOrValue(router.query.type)
    if (type && isGenreType(type)) return type
  }, [router.query.type])

  const parentId = useMemo(() => {
    const parentIdStr = getFirstOrValue(router.query.parentId)
    if (parentIdStr !== undefined)
      return fromCorrectionIdApiInputKey(parentIdStr)
  }, [router.query.parentId])

  return (
    <ClientOnly>
      <CreateView type={type} parentId={parentId} />
    </ClientOnly>
  )
}

export default Create
