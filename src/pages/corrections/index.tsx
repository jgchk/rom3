import { NextPage } from 'next'

import useAuthorizedPageRedirect from '../../common/hooks/useAuthorizedPageRedirect'
import CorrectionsList from '../../modules/correction/components/CorrectionsList'

const CorrectionsPage: NextPage = () => {
  useAuthorizedPageRedirect()

  return (
    <div className='flex justify-center p-3'>
      <div className='flex-1 max-w-screen-lg'>
        <CorrectionsList />
      </div>
    </div>
  )
}

export default CorrectionsPage
