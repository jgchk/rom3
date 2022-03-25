import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'

const Navbar: FC = () => {
  const router = useRouter()

  return (
    <nav className='flex justify-center bg-gray-100 px-2 h-10 shadow z-10'>
      <div className='flex-1 max-w-screen-lg flex items-center space-x-4'>
        <div className='font-mackinac font-bold text-2xl'>Romulus</div>
        <div className='h-full flex'>
          <Link href='/genres/tree'>
            <a
              className={clsx(
                'flex items-center border-b-2 px-2 font-medium hover:bg-gray-200',
                router.pathname === '/genres/tree'
                  ? 'border-primary-600'
                  : 'border-transparent'
              )}
            >
              Tree
            </a>
          </Link>
          <Link href='/corrections'>
            <a
              className={clsx(
                'flex items-center border-b-2 px-2 font-medium hover:bg-gray-200',
                router.pathname.startsWith('/corrections')
                  ? 'border-primary-600'
                  : 'border-transparent'
              )}
            >
              Corrections
            </a>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
