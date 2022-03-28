import { Account } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import createRouter from '../createRouter'
import prisma from '../prisma'

type AccountApiOutput = Omit<Account, 'password'>

const toAccountApiOutput = (account: Account): AccountApiOutput => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...data } = account
  return data
}

const getAccount = async (id: number): Promise<AccountApiOutput> => {
  const account = await prisma.account.findUnique({ where: { id } })
  if (!account) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No account with id '${id}'`,
    })
  }
  return toAccountApiOutput(account)
}

const accountsRouter = createRouter().query('byId', {
  input: z.object({ id: z.number() }),
  resolve: async ({ input, ctx }) => {
    if (ctx.accountId === undefined)
      throw new TRPCError({ code: 'UNAUTHORIZED' })

    return getAccount(input.id)
  },
})

export default accountsRouter
