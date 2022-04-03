import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useRef, useState } from 'react'

import { useFromQueryParams } from '../hooks/useFromQueryParam'
import useLoggedInQuery from '../hooks/useLoggedInQuery'
import { useWhoamiQuery } from '../services/auth'
import { clearToken } from '../utils/auth'
import trpc from '../utils/trpc'
import Loader from './Loader'

const Navbar: FC = () => {
  const router = useRouter()

  const { data: loggedIn } = useLoggedInQuery()

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
            Genres
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
            Corrections Queue
          </a>
        </Link>
        {loggedIn && (
          <Link href='/corrections/mine'>
            <a
              className={clsx(
                'px-2 h-full flex items-center text-sm font-semibold text-stone-800 hover:text-primary-600 border-b-2',
                router.pathname === '/corrections/mine'
                  ? 'border-primary-500'
                  : 'border-transparent'
              )}
            >
              My Corrections
            </a>
          </Link>
        )}
        <div className='flex-1' />
        <Account />
      </div>
    </nav>
  )
}

export default Navbar

const Account: FC = () => {
  const { pathname } = useRouter()
  const query = useFromQueryParams()

  const { data } = useWhoamiQuery()

  if (!data) {
    return (
      <div>
        <Loader className='text-stone-800' />
      </div>
    )
  }

  if (data === 'LOGGED_OUT') {
    return (
      <>
        <Link href={{ pathname: '/login', query }}>
          <a
            className={clsx(
              'px-2 h-full flex items-center text-sm font-semibold text-stone-800 hover:text-primary-600 border-b-2',
              pathname === '/login'
                ? 'border-primary-500'
                : 'border-transparent'
            )}
          >
            Login
          </a>
        </Link>
        <Link href={{ pathname: '/register', query }}>
          <a
            className={clsx(
              'px-2 h-full flex items-center text-sm font-semibold text-stone-800 hover:text-primary-600 border-b-2',
              pathname === '/register'
                ? 'border-primary-500'
                : 'border-transparent'
            )}
          >
            Register
          </a>
        </Link>
      </>
    )
  }

  return <LoggedIn username={data.username} />
}

const LoggedIn: FC<{ username: string }> = ({ username }) => {
  const [open, setOpen] = useState(false)

  const utils = trpc.useContext()
  const handleLogout = useCallback(() => {
    clearToken()
    void utils.invalidateQueries('auth.whoami')
  }, [utils])

  // Close the menu whenever user clicks outside the menu element or trigger button.
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (
        containerRef.current &&
        e.target &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('click', listener)
    return () => document.removeEventListener('click', listener)
  }, [])

  return (
    <div className='relative h-full' ref={containerRef}>
      <button
        className='px-2 h-full flex items-center text-sm font-semibold text-stone-800 hover:text-primary-600 border-b-2 border-transparent'
        onClick={() => setOpen(!open)}
      >
        {username}
      </button>
      {open && (
        <menu className='absolute bg-stone-100 border border-stone-300 shadow right-0'>
          <button
            className='text-sm font-medium text-stone-600 hover:bg-stone-200 px-4 py-3'
            onClick={() => handleLogout()}
          >
            Logout
          </button>
        </menu>
      )}
    </div>
  )
}
