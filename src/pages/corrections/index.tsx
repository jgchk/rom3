import { NextPage } from 'next'

import CorrectionsList from '../../modules/correction/components/CorrectionsList'

const CorrectionsPage: NextPage = () => (
  <div className='flex justify-center p-3'>
    <div className='flex-1 max-w-screen-lg'>
      <CorrectionsList />
    </div>
  </div>
)

export default CorrectionsPage
