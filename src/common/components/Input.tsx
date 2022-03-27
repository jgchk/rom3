import clsx from 'clsx'
import { FC, InputHTMLAttributes } from 'react'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input: FC<InputProps> = ({ className, ...props }) => (
  <input
    className={clsx(
      'bg-white shadow-sm border border-stone-300 px-2 py-1 focus:outline-none focus:border-primary-500 ring-0 focus:ring-1 focus:ring-primary-500 transition',
      className
    )}
    {...props}
  />
)

export default Input
