import {
  PrismaClient,
  Style,
  Trend,
  TrendName,
  TrendStyleInfluence,
  TrendStyleParent,
  TrendTrendInfluence,
  TrendTrendParent,
} from '@prisma/client'
import * as trpc from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const prisma = new PrismaClient()

export const TrendInput = z.object({
  name: z.string().min(1),
  shortDesc: z.string().min(1),
  longDesc: z.string().min(1),
  alternateNames: z.array(z.string()),
  parentTrends: z.array(z.number()),
  parentStyles: z.array(z.number()),
  influencedByTrends: z.array(z.number()),
  influencedByStyles: z.array(z.number()),
})
export type TrendInput = z.infer<typeof TrendInput>

export type TrendOutput = Trend & {
  type: 'trend'
  alternateNames: string[]
  parentTrends: Trend[]
  parentStyles: Style[]
  influencedByTrends: Trend[]
  influencedByStyles: Style[]
}

const toOutput = (
  trend: Trend & {
    alternateNames: TrendName[]
    parentTrends: (TrendTrendParent & { parent: Trend })[]
    parentStyles: (TrendStyleParent & { parent: Style })[]
    influencedByTrends: (TrendTrendInfluence & { influencer: Trend })[]
    influencedByStyles: (TrendStyleInfluence & { influencer: Style })[]
  }
): TrendOutput => ({
  ...trend,
  type: 'trend',
  alternateNames: trend.alternateNames.map((an) => an.name),
  parentTrends: trend.parentTrends.map((p) => p.parent),
  parentStyles: trend.parentStyles.map((p) => p.parent),
  influencedByTrends: trend.influencedByTrends.map((inf) => inf.influencer),
  influencedByStyles: trend.influencedByStyles.map((inf) => inf.influencer),
})

export const addTrend = async (input: TrendInput): Promise<TrendOutput> => {
  const trend = await prisma.trend.create({
    data: {
      ...input,
      alternateNames: {
        create: input.alternateNames.map((name) => ({ name })),
      },
      parentTrends: {
        create: input.parentTrends.map((id) => ({ parentId: id })),
      },
      parentStyles: {
        create: input.parentStyles.map((id) => ({ parentId: id })),
      },
      influencedByTrends: {
        create: input.influencedByTrends.map((id) => ({ influencerId: id })),
      },
      influencedByStyles: {
        create: input.influencedByStyles.map((id) => ({ influencerId: id })),
      },
    },
    include: {
      alternateNames: true,
      parentTrends: { include: { parent: true } },
      parentStyles: { include: { parent: true } },
      influencedByTrends: { include: { influencer: true } },
      influencedByStyles: { include: { influencer: true } },
    },
  })
  return toOutput(trend)
}

export const getTrend = async (id: number): Promise<TrendOutput> => {
  const trend = await prisma.trend.findUnique({
    where: { id },
    include: {
      alternateNames: true,
      parentTrends: { include: { parent: true } },
      parentStyles: { include: { parent: true } },
      influencedByTrends: { include: { influencer: true } },
      influencedByStyles: { include: { influencer: true } },
    },
  })
  if (!trend) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No trend with id '${id}'`,
    })
  }
  return toOutput(trend)
}

export const editTrend = async (
  id: number,
  data: TrendInput
): Promise<TrendOutput> => {
  await prisma.trendName.deleteMany({ where: { trendId: id } })
  await prisma.trendTrendParent.deleteMany({ where: { childId: id } })
  await prisma.trendStyleParent.deleteMany({ where: { childId: id } })
  await prisma.trendTrendInfluence.deleteMany({ where: { influencedId: id } })
  await prisma.trendStyleInfluence.deleteMany({ where: { influencedId: id } })
  const trend = await prisma.trend.update({
    where: { id: id },
    data: {
      ...data,
      alternateNames: {
        create: data.alternateNames.map((name) => ({ name })),
      },
      parentTrends: {
        create: data.parentTrends.map((id) => ({ parentId: id })),
      },
      parentStyles: {
        create: data.parentStyles.map((id) => ({ parentId: id })),
      },
      influencedByTrends: {
        create: data.influencedByTrends.map((id) => ({ influencerId: id })),
      },
      influencedByStyles: {
        create: data.influencedByStyles.map((id) => ({ influencerId: id })),
      },
    },
    include: {
      alternateNames: true,
      parentTrends: { include: { parent: true } },
      parentStyles: { include: { parent: true } },
      influencedByTrends: { include: { influencer: true } },
      influencedByStyles: { include: { influencer: true } },
    },
  })
  return toOutput(trend)
}

export const deleteTrend = async (id: number): Promise<number> => {
  const deleteNames = prisma.trendName.deleteMany({ where: { trendId: id } })
  const deleteTrendParents = prisma.trendTrendParent.deleteMany({
    where: { childId: id },
  })
  const deleteStyleParents = prisma.trendStyleParent.deleteMany({
    where: { childId: id },
  })
  const deleteTrendChildren = prisma.trendTrendParent.deleteMany({
    where: { parentId: id },
  })
  const deleteInfluencesTrends = prisma.trendTrendInfluence.deleteMany({
    where: { influencerId: id },
  })
  const deleteInfluencedByTrends = prisma.trendTrendInfluence.deleteMany({
    where: { influencedId: id },
  })
  const deleteInfluencedByStyles = prisma.trendStyleInfluence.deleteMany({
    where: { influencedId: id },
  })
  const deleteTrend = prisma.trend.delete({ where: { id } })
  await prisma.$transaction([
    deleteNames,
    deleteTrendParents,
    deleteStyleParents,
    deleteTrendChildren,
    deleteInfluencesTrends,
    deleteInfluencedByTrends,
    deleteInfluencedByStyles,
    deleteTrend,
  ])
  return id
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
    input: z.object({
      id: z.number(),
      data: TrendInput,
    }),
    resolve: ({ input }) => editTrend(input.id, input.data),
  })
  .mutation('delete', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => deleteTrend(input.id),
  })

export default trendsRouter
