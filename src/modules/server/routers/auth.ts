import { Account } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

import createRouter from '../createRouter'
import prisma from '../prisma'
import { createAuthToken } from '../utils/auth'

type AccountApiOutput = Omit<Account, 'password'>

const toAccountApiOutput = (account: Account): AccountApiOutput => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...data } = account
  return data
}

const authRouter = createRouter()
  .mutation('register', {
    input: z.object({
      username: z.string().min(1),
      password: z.string().min(1),
    }),
    resolve: async ({ input }) => {
      const password = await bcrypt.hash(input.password, 8)
      const account = await prisma.account.create({
        data: { username: input.username, password },
      })
      return {
        account: toAccountApiOutput(account),
        token: createAuthToken(account.id),
      }
    },
  })
  .mutation('login', {
    input: z.object({
      username: z.string().min(1),
      password: z.string().min(1),
    }),
    resolve: async ({ input }) => {
      const account = await prisma.account.findUnique({
        where: { username: input.username },
      })

      if (!account) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const checkPassword = await bcrypt.compare(
        input.password,
        account.password
      )

      if (!checkPassword) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return {
        account: toAccountApiOutput(account),
        token: createAuthToken(account.id),
      }
    },
  })
  .query('whoami', {
    resolve: async ({ ctx }) => {
      if (ctx.accountId === undefined) return null

      const account = await prisma.account.findUnique({
        where: { id: ctx.accountId },
      })

      if (account === null) return null

      return toAccountApiOutput(account)
    },
  })

export default authRouter
