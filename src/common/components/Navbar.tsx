import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback, useMemo, useState } from 'react'

import useLoggedInQuery from '../hooks/useLoggedInQuery'
import { useWhoamiQuery } from '../services/auth'
import { clearToken } from '../utils/auth'
import trpc from '../utils/trpc'

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
            Genre Tree
          </a>
        </Link>
        {loggedIn && (
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
        )}
        <div className='flex-1' />
        <Account />
      </div>
    </nav>
  )
}

export default Navbar

const Account: FC = () => {
  const { asPath, query, pathname } = useRouter()

  const { data } = useWhoamiQuery()

  const from = useMemo(() => {
    const from = query.from ?? asPath
    return from === '/login' || from === '/register' ? undefined : from
  }, [asPath, query.from])

  if (!data) {
    return <div>Loading...</div>
  }

  if (data === 'LOGGED_OUT') {
    return (
      <>
        <Link href={{ pathname: '/login', query: from ? { from } : {} }}>
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
        <Link href={{ pathname: '/register', query: from ? { from } : {} }}>
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

  return (
    <div className='relative'>
      <button onClick={() => setOpen(!open)}>{username}</button>
      {open && (
        <div className='absolute'>
          <button onClick={() => handleLogout()}>Logout</button>
        </div>
      )}
    </div>
  )
}
