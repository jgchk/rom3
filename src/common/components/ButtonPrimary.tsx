import clsx from 'clsx'
import { ButtonHTMLAttributes, FC } from 'react'

const ButtonPrimary: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => (
  <button
    className={clsx(
      'px-3 py-2 text-sm uppercase font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-sm shadow-gray-400 focus:outline-none border border-transparent focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition',
      className
    )}
    {...props}
  >
    {children}
  </button>
)

export default ButtonPrimary
