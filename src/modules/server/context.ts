import { inferAsyncReturnType } from '@trpc/server'
import { CreateNextContextOptions } from '@trpc/server/adapters/next'

import { parseAuthToken } from './utils/auth'

export const createContext = ({ req }: CreateNextContextOptions) => {
  const getAccountFromCookie = () => {
    const token = req.cookies.token
    if (!token) return

    return parseAuthToken(token)
  }

  const getAccountFromHeader = () => {
    if (!req.headers.authorization) return

    const token = req.headers.authorization.split(' ')[1]
    if (!token) return

    return parseAuthToken(token)
  }

  const accountId = getAccountFromCookie() ?? getAccountFromHeader()

  return { accountId }
}

export type Context = inferAsyncReturnType<typeof createContext>
