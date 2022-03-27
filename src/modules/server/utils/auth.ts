import { z } from 'zod'

import { signToken, verifyToken } from './jwt'

const Token = z.object({
  id: z.number(),
})

export const createAuthToken = (id: number) => signToken({ id })

export const parseAuthToken = (token: string) => {
  const val = verifyToken(token)
  const res = Token.safeParse(val)
  return res.success ? res.data.id : undefined
}
