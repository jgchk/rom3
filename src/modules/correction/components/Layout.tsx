import { FC } from 'react'

import { CorrectionContextProvider } from '../contexts/CorrectionContext'
import Navbar from './Navbar'

const Layout: FC<{ correctionId: number }> = ({ correctionId, children }) => (
  <CorrectionContextProvider id={correctionId}>
    <div className='flex flex-col w-full h-full'>
      <Navbar />
      <div className='flex-1 flex justify-center'>
        <div className='flex-1 max-w-screen-lg'>{children}</div>
      </div>
    </div>
  </CorrectionContextProvider>
)

export default Layout
