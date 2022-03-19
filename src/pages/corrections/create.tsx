import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import { getFirstOrValue } from '../../common/utils/array'
import DeletePage from '../../modules/corrections/components/DeletePage'
import EditPage from '../../modules/corrections/components/EditPage'
import { isGenreName } from '../../modules/genres/model'

const Create: NextPage = () => {
  const router = useRouter()

  const action = useMemo(() => {
    const action_ = getFirstOrValue(router.query.action)
    return action_
  }, [router.query.action])

  const type = useMemo(() => {
    const type_ = getFirstOrValue(router.query.type)
    if (type_ && isGenreName(type_)) return type_
  }, [router.query.type])

  const id = useMemo(() => {
    const idStr = getFirstOrValue(router.query.id)
    if (idStr === undefined) return
    const idNum = Number.parseInt(idStr)
    if (Number.isNaN(idNum)) return
    return idNum
  }, [router.query.id])

  if (action === 'edit') {
    if (type === undefined || id === undefined) {
      return <div>Params missing</div>
    }

    return <EditPage type={type} id={id} />
  }

  if (action === 'delete') {
    if (type === undefined || id === undefined) {
      return <div>Params missing</div>
    }

    return <DeletePage type={type} id={id} />
  }

  return <div>Invalid action: {action}</div>
}

export default Create
