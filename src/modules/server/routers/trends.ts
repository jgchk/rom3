import {
  Culture,
  Location,
  Meta,
  Style,
  Trend,
  TrendCulture,
  TrendLocation,
  TrendMetaParent,
  TrendName,
  TrendStyleInfluence,
  TrendStyleParent,
  TrendTrendInfluence,
  TrendTrendParent,
} from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import createRouter from '../createRouter'
import prisma from '../prisma'
import {
  BaseGenreInput,
  CulturesInput,
  IdsInput,
  LocationsInput,
} from '../utils/validators'

export const TrendInput = BaseGenreInput.extend({
  parentTrends: IdsInput,
  parentStyles: IdsInput,
  parentMetas: IdsInput,
  influencedByTrends: IdsInput,
  influencedByStyles: IdsInput,
  locations: LocationsInput,
  cultures: CulturesInput,
})
export type TrendInput = z.infer<typeof TrendInput>

export type TrendOutput = Trend & {
  type: 'trend'
  alternateNames: string[]
  parentTrends: Trend[]
  parentStyles: Style[]
  parentMetas: Meta[]
  influencedByTrends: Trend[]
  influencedByStyles: Style[]
  locations: Location[]
  cultures: Culture[]
}

const toOutput = (
  trend: Trend & {
    alternateNames: TrendName[]
    parentTrends: (TrendTrendParent & { parent: Trend })[]
    parentStyles: (TrendStyleParent & { parent: Style })[]
    parentMetas: (TrendMetaParent & { parent: Meta })[]
    influencedByTrends: (TrendTrendInfluence & { influencer: Trend })[]
    influencedByStyles: (TrendStyleInfluence & { influencer: Style })[]
    locations: (TrendLocation & { location: Location })[]
    cultures: (TrendCulture & { culture: Culture })[]
  }
): TrendOutput => ({
  ...trend,
  type: 'trend',
  alternateNames: trend.alternateNames.map((an) => an.name),
  parentTrends: trend.parentTrends.map((p) => p.parent),
  parentStyles: trend.parentStyles.map((p) => p.parent),
  parentMetas: trend.parentMetas.map((p) => p.parent),
  influencedByTrends: trend.influencedByTrends.map((inf) => inf.influencer),
  influencedByStyles: trend.influencedByStyles.map((inf) => inf.influencer),
  locations: trend.locations.map((loc) => loc.location),
  cultures: trend.cultures.map((c) => c.culture),
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
      parentMetas: {
        create: input.parentMetas.map((id) => ({ parentId: id })),
      },
      influencedByTrends: {
        create: input.influencedByTrends.map((id) => ({ influencerId: id })),
      },
      influencedByStyles: {
        create: input.influencedByStyles.map((id) => ({ influencerId: id })),
      },
      locations: {
        create: input.locations.map((loc) => ({
          location: {
            connectOrCreate: {
              where: {
                city_region_country: {
                  city: loc.city,
                  region: loc.region,
                  country: loc.country,
                },
              },
              create: {
                city: loc.city,
                region: loc.region,
                country: loc.country,
              },
            },
          },
        })),
      },
      cultures: {
        create: input.cultures.map((c) => ({
          culture: {
            connectOrCreate: { where: { name: c }, create: { name: c } },
          },
        })),
      },
    },
    include: {
      alternateNames: true,
      parentTrends: { include: { parent: true } },
      parentStyles: { include: { parent: true } },
      parentMetas: { include: { parent: true } },
      influencedByTrends: { include: { influencer: true } },
      influencedByStyles: { include: { influencer: true } },
      locations: { include: { location: true } },
      cultures: { include: { culture: true } },
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
      parentMetas: { include: { parent: true } },
      influencedByTrends: { include: { influencer: true } },
      influencedByStyles: { include: { influencer: true } },
      locations: { include: { location: true } },
      cultures: { include: { culture: true } },
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

export const getTrends = async (): Promise<TrendOutput[]> => {
  const trends = await prisma.trend.findMany({
    include: {
      alternateNames: true,
      parentTrends: { include: { parent: true } },
      parentStyles: { include: { parent: true } },
      parentMetas: { include: { parent: true } },
      influencedByTrends: { include: { influencer: true } },
      influencedByStyles: { include: { influencer: true } },
      locations: { include: { location: true } },
      cultures: { include: { culture: true } },
    },
  })
  return trends.map(toOutput)
}

export const editTrend = async (
  id: number,
  data: TrendInput
): Promise<TrendOutput> => {
  await prisma.trendName.deleteMany({ where: { trendId: id } })
  await prisma.trendTrendParent.deleteMany({ where: { childId: id } })
  await prisma.trendStyleParent.deleteMany({ where: { childId: id } })
  await prisma.trendMetaParent.deleteMany({ where: { childId: id } })
  await prisma.trendTrendInfluence.deleteMany({ where: { influencedId: id } })
  await prisma.trendStyleInfluence.deleteMany({ where: { influencedId: id } })
  await prisma.trendLocation.deleteMany({ where: { trendId: id } })
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
      parentMetas: {
        create: data.parentMetas.map((id) => ({ parentId: id })),
      },
      influencedByTrends: {
        create: data.influencedByTrends.map((id) => ({ influencerId: id })),
      },
      influencedByStyles: {
        create: data.influencedByStyles.map((id) => ({ influencerId: id })),
      },
      locations: {
        create: data.locations.map((loc) => ({
          location: {
            connectOrCreate: {
              where: {
                city_region_country: {
                  city: loc.city,
                  region: loc.region,
                  country: loc.country,
                },
              },
              create: {
                city: loc.city,
                region: loc.region,
                country: loc.country,
              },
            },
          },
        })),
      },
      cultures: {
        create: data.cultures.map((c) => ({
          culture: {
            connectOrCreate: { where: { name: c }, create: { name: c } },
          },
        })),
      },
    },
    include: {
      alternateNames: true,
      parentTrends: { include: { parent: true } },
      parentStyles: { include: { parent: true } },
      parentMetas: { include: { parent: true } },
      influencedByTrends: { include: { influencer: true } },
      influencedByStyles: { include: { influencer: true } },
      locations: { include: { location: true } },
      cultures: { include: { culture: true } },
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
  const deleteMetaParents = prisma.trendMetaParent.deleteMany({
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
  const deleteLocations = prisma.trendLocation.deleteMany({
    where: { trendId: id },
  })
  const deleteTrend = prisma.trend.delete({ where: { id } })
  await prisma.$transaction([
    deleteNames,
    deleteTrendParents,
    deleteStyleParents,
    deleteMetaParents,
    deleteTrendChildren,
    deleteInfluencesTrends,
    deleteInfluencedByTrends,
    deleteInfluencedByStyles,
    deleteLocations,
    deleteTrend,
  ])
  return id
}

const trendsRouter = createRouter()
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
