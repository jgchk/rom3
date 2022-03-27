import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'

const Navbar: FC = () => {
  const router = useRouter()

  return (
    <nav className='flex justify-center px-2 h-10 z-10 bg-stone-300 shadow'>
      <div className='flex-1 max-w-screen-lg flex items-center'>
        <div className='font-mackinac font-bold text-2xl text-stone-800 mr-6'>
          Romulus
        </div>
        <Link href='/genres/tree'>
          <a
            className={clsx(
              'px-2 h-full flex items-center text-sm font-semibold text-stone-800 hover:text-primary-600 border-b-2',
              router.pathname === '/genres/tree'
                ? 'border-primary-500'
                : 'border-transparent'
            )}
          >
            Genre Tree
          </a>
        </Link>
        <Link href='/corrections'>
          <a
            className={clsx(
              'px-2 h-full flex items-center text-sm font-semibold text-stone-800 hover:text-primary-600 border-b-2',
              router.pathname === '/corrections'
                ? 'border-primary-500'
                : 'border-transparent'
            )}
          >
            Corrections
          </a>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
