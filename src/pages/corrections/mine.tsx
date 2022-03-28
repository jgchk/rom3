import { NextPage } from 'next'

import useAuthorizedPageRedirect from '../../common/hooks/useAuthorizedPageRedirect'
import CorrectionsListMine from '../../modules/correction/components/CorrectionsListMine'

const MyCorrectionsPage: NextPage = () => {
  useAuthorizedPageRedirect()

  return (
    <div className='flex justify-center p-3'>
      <div className='flex-1 max-w-screen-lg'>
        <CorrectionsListMine />
      </div>
    </div>
  )
}

export default MyCorrectionsPage
