import { FC } from 'react'
import { createPortal } from 'react-dom'

const Dialog: FC = ({ children }) =>
  createPortal(
    <div className='absolute top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-25 z-20'>
      <div className='bg-white'>{children}</div>
    </div>,
    document.body
  )

export default Dialog
