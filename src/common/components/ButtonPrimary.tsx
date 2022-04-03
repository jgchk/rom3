import clsx from 'clsx'
import Link, { LinkProps } from 'next/link'
import { ButtonHTMLAttributes, FC } from 'react'
import { FiLoader } from 'react-icons/fi'

const defaultClassName = clsx(
  'inline-flex items-center px-3 py-2 text-sm uppercase font-bold text-white bg-primary-600 shadow-sm shadow-gray-400 border border-transparent transition',
  'hover:bg-primary-700 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
  'disabled:bg-stone-500'
)

const ButtonPrimary: FC<
  ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }
> = ({ children, className, loading, ...props }) => (
  <button className={clsx(defaultClassName, className)} {...props}>
    {loading && <FiLoader className='animate-spin-slow mr-2 text-base' />}
    {children}
  </button>
)

export default ButtonPrimary

export const ButtonPrimaryLink: FC<LinkProps & { className?: string }> = ({
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
