import clsx from 'clsx'
import { ButtonHTMLAttributes, FC } from 'react'

const ButtonTertiary: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => (
  <button
    className={clsx(
      'px-3 py-2 text-sm uppercase font-bold text-stone-500 hover:text-primary-600 focus:text-primary-600 focus:outline-none border border-transparent focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition',
      className
    )}
    {...props}
  >
    {children}
  </button>
)

export default ButtonTertiary
