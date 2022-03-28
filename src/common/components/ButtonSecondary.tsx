import clsx from 'clsx'
import { ButtonHTMLAttributes, FC } from 'react'

const ButtonSecondary: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => (
  <button
    className={clsx(
      'px-3 py-2 text-sm uppercase font-bold hover:bg-primary-600 text-primary-500 hover:text-white drop-shadow-sm focus:outline-none border-2 border-primary-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition',
      className
    )}
    {...props}
  >
    {children}
  </button>
)

export default ButtonSecondary
