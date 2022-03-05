import { PrismaClient } from '@prisma/client'
import * as trpc from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const Trend = z.object({
  name: z.string().min(1),
  shortDesc: z.string().min(1),
  longDesc: z.string().min(1),
  alternateNames: z.array(z.string()),
  trendInfluencedBy: z.array(z.number()),
  styleInfluencedBy: z.array(z.number()),
})

const prisma = new PrismaClient()

const trendsRouter = trpc
  .router()
  .mutation('add', {
    input: Trend,
    resolve: async ({ input }) => {
      const trend = await prisma.trend.create({
        data: {
          ...input,
          alternateNames: {
            create: input.alternateNames.map((name) => ({ name })),
          },
          trendInfluencedBy: {
            connect: input.trendInfluencedBy.map((id) => ({ id })),
          },
          styleInfluencedBy: {
            connect: input.styleInfluencedBy.map((id) => ({ id })),
          },
        },
      })
      return trend
    },
  })
  .query('all', {
    resolve: async () => {
      const trends = await prisma.trend.findMany()
      return trends
    },
  })
  .query('byId', {
    input: z.object({ id: z.number() }),
    resolve: async ({ input }) => {
      const trend = await prisma.trend.findUnique({ where: { id: input.id } })
      if (!trend) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No trend with id '${input.id}'`,
        })
      }
      return trend
    },
  })
  .mutation('edit', {
    input: Trend.extend({
      id: z.number(),
    }),
    resolve: async ({ input }) => {
      const trend = await prisma.trend.update({
        where: { id: input.id },
        data: {
          ...input,
          alternateNames: {
            create: input.alternateNames.map((name) => ({ name })),
          },
          trendInfluencedBy: {
            connect: input.trendInfluencedBy.map((id) => ({ id })),
          },
          styleInfluencedBy: {
            connect: input.styleInfluencedBy.map((id) => ({ id })),
          },
        },
      })
      return trend
    },
  })
  .mutation('delete', {
    input: z.object({ id: z.number() }),
    resolve: async ({ input }) => {
      await prisma.trend.delete({ where: { id: input.id } })
      return input.id
    },
  })

export default trendsRouter
