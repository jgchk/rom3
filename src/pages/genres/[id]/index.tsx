import { NextPage } from 'next'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import { getFirstOrValue } from '../../../common/utils/array'
import Genre from '../../../modules/viewer/components/Genre'

const GenrePage: NextPage = () => {
  const { query } = useRouter()

  const id = useMemo(() => {
    const idStr = getFirstOrValue(query.id)
    if (idStr === undefined) return
    const id = Number.parseInt(idStr)
    if (Number.isNaN(id)) return
    return id
  }, [query.id])

  if (id === undefined) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <div className='flex justify-center p-3'>
      <div className='flex-1 max-w-screen-lg'>
        <Genre id={id} />
      </div>
    </div>
  )
}

export default GenrePage
