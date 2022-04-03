import clsx from 'clsx'
import { FC } from 'react'
import { FiLoader } from 'react-icons/fi'

const Loader: FC<{ className?: string; size?: string | number }> = ({
  className,
  size,
}) => (
  <div
    className={clsx(
      'w-full h-full flex items-center justify-center',
      className
    )}
  >
    <FiLoader className='animate-spin-slow mr-2 text-base' size={size} />
  </div>
)

export default Loader
