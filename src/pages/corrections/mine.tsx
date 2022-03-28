import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import useLoggedInQuery from '../../common/hooks/useLoggedInQuery'
import CorrectionsListMine from '../../modules/correction/components/CorrectionsListMine'

const MyCorrectionsPage: NextPage = () => {
  const { data: isLoggedIn } = useLoggedInQuery()
  const { push: navigate } = useRouter()
  useEffect(() => {
    if (isLoggedIn === false) {
      void navigate('/corrections')
    }
  }, [isLoggedIn, navigate])

  return (
    <div className='flex justify-center p-3'>
      <div className='flex-1 max-w-screen-lg'>
        <CorrectionsListMine />
      </div>
    </div>
  )
}

export default MyCorrectionsPage
