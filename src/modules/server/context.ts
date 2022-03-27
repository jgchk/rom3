import { inferAsyncReturnType } from '@trpc/server'
import { CreateNextContextOptions } from '@trpc/server/adapters/next'

import { verifyToken } from './utils/jwt'

export const createContext = ({ req }: CreateNextContextOptions) => {
  console.log('CONTEXT', req.headers)

  const getAccountFromHeader = () => {
    if (!req.headers.authorization) return

    const token = req.headers.authorization.split(' ')[1]
    if (!token) return

    const account = verifyToken(token)
    console.log(account)
    return account
  }

  const user = getAccountFromHeader()

  return { user }
}

export type Context = inferAsyncReturnType<typeof createContext>
