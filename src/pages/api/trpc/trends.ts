import { PrismaClient, Style, Trend } from '@prisma/client'
import * as trpc from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const prisma = new PrismaClient()

export const TrendInput = z.object({
  name: z.string().min(1),
  shortDesc: z.string().min(1),
  longDesc: z.string().min(1),
  alternateNames: z.array(z.string()),
  trendInfluencedBy: z.array(z.number()),
  styleInfluencedBy: z.array(z.number()),
  parentTrends: z.array(z.number()),
  parentStyles: z.array(z.number()),
})
export type TrendInput = z.infer<typeof TrendInput>

export type TrendOutput = Trend & {
  type: 'trend'
  alternateNames: string[]
  trendInfluencedBy: Trend[]
  styleInfluencedBy: Style[]
  parentTrends: Trend[]
  parentStyles: Style[]
}

export const addTrend = (input: TrendInput) =>
  prisma.trend.create({
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
      parentTrends: {
        connect: input.parentTrends.map((id) => ({ id })),
      },
      parentStyles: { connect: input.parentStyles.map((id) => ({ id })) },
    },
  })

export const getTrend = async (id: number): Promise<TrendOutput> => {
  const trend = await prisma.trend.findUnique({
    where: { id },
    include: {
      alternateNames: true,
      trendInfluencedBy: true,
      styleInfluencedBy: true,
      parentTrends: true,
      parentStyles: true,
    },
  })
  if (!trend) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No trend with id '${id}'`,
    })
  }
  return {
    ...trend,
    type: 'trend',
    alternateNames: trend.alternateNames.map((an) => an.name),
  }
}

const trendsRouter = trpc
  .router()
  .mutation('add', {
    input: TrendInput,
    resolve: ({ input }) => addTrend(input),
  })
  .query('all', {
    resolve: async () => {
      const trends = await prisma.trend.findMany()
      return trends
    },
  })
  .query('byId', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => getTrend(input.id),
  })
  .mutation('edit', {
    input: TrendInput.extend({
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
          parentTrends: {
            connect: input.parentTrends.map((id) => ({ id })),
          },
          parentStyles: { connect: input.parentStyles.map((id) => ({ id })) },
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
