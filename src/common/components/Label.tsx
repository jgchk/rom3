import clsx from 'clsx'
import { FC, LabelHTMLAttributes } from 'react'

const Label: FC<LabelHTMLAttributes<HTMLLabelElement>> = ({
  children,
  className,
  ...props
}) => (
  <label
    className={clsx('block text-sm font-medium text-stone-700', className)}
    {...props}
  >
    {children}
  </label>
)

export default Label
