import clsx from 'clsx'
import { FC, InputHTMLAttributes } from 'react'

const Checkbox: FC<InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  ...props
}) => (
  <input
    className={clsx(
      'appearance-none w-6 h-6 border border-stone-300 shadow-sm bg-white checked:bg-primary-600 checked:bg-check focus:outline-none focus:border-primary-500 ring-0 focus:ring-1 focus:ring-primary-500 transition',
      className
    )}
    type='checkbox'
    {...props}
  />
)

export default Checkbox
