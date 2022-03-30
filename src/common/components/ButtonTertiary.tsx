import clsx from 'clsx'
import Link, { LinkProps } from 'next/link'
import { ButtonHTMLAttributes, FC } from 'react'

const defaultClassName =
  'px-3 py-2 text-sm uppercase font-bold text-stone-500 hover:text-primary-600 focus:text-primary-600 focus:outline-none border border-transparent focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition'

const ButtonTertiary: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => (
  <button className={clsx(defaultClassName, className)} {...props}>
    {children}
  </button>
)

export default ButtonTertiary

export const ButtonTertiaryLink: FC<LinkProps & { className?: string }> = ({
  children,
  className,
  ...props
}) => (
  <Link {...props}>
    <a className={clsx('inline-block', defaultClassName, className)}>
      {children}
    </a>
  </Link>
)
