import clsx from 'clsx'
import { FC, TextareaHTMLAttributes } from 'react'

const TextArea: FC<TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  className,
  ...props
}) => (
  <textarea
    className={clsx(
      'bg-white shadow-sm border border-stone-300 px-2 py-1 focus:outline-none focus:border-primary-500 ring-0 focus:ring-1 focus:ring-primary-500 transition',
      className
    )}
    {...props}
  />
)

export default TextArea
