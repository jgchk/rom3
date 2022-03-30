/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import clsx from 'clsx'
import Link, { LinkProps } from 'next/link'
import { ButtonHTMLAttributes, FC, forwardRef } from 'react'

const defaultClassName = clsx(
  'px-3 py-2 text-sm uppercase font-bold text-primary-500 drop-shadow-sm border-2 border-primary-500 transition',
  'hover:bg-primary-600 hover:text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
  'disabled:text-stone-500 disabled:border-stone-500 disabled:hover:bg-transparent'
)

const ButtonSecondary = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, ref) => (
  <button ref={ref} className={clsx(defaultClassName, className)} {...props}>
    {children}
  </button>
))

export default ButtonSecondary

export const ButtonSecondaryLink: FC<LinkProps & { className?: string }> = ({
  children,
  className,
  ...props
}) => (
  <div>
    <Link {...props}>
      <a className={clsx(defaultClassName, className)}>{children}</a>
    </Link>
  </div>
)
