import {
  Culture,
  InfluenceType,
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
  StyleInfluencesInput,
} from '../utils/validators/misc'

export const TrendApiInput = BaseGenreInput.extend({
  parentTrends: IdsInput,
  parentStyles: IdsInput,
  parentMetas: IdsInput,
  influencedByTrends: IdsInput,
  influencedByStyles: StyleInfluencesInput,
  locations: LocationsInput,
  cultures: CulturesInput,
})
export type TrendApiInput = z.infer<typeof TrendApiInput>

export const TypedTrendApiInput = z.object({
  type: z.literal('trend'),
  data: TrendApiInput,
})

export type TrendApiOutput = Trend & {
  type: 'trend'
  alternateNames: string[]
  parentTrends: Trend[]
  parentStyles: Style[]
  parentMetas: Meta[]
  influencedByTrends: Trend[]
  influencedByStyles: (Style & { influenceType: InfluenceType })[]
  locations: Location[]
  cultures: Culture[]
}

const toApiOutput = (
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
): TrendApiOutput => ({
  ...trend,
  type: 'trend',
  alternateNames: trend.alternateNames.map((an) => an.name),
  parentTrends: trend.parentTrends.map((p) => p.parent),
  parentStyles: trend.parentStyles.map((p) => p.parent),
  parentMetas: trend.parentMetas.map((p) => p.parent),
  influencedByTrends: trend.influencedByTrends.map((inf) => inf.influencer),
  influencedByStyles: trend.influencedByStyles.map((inf) => ({
    ...inf.influencer,
    influenceType: inf.influenceType,
  })),
  locations: trend.locations.map((loc) => loc.location),
  cultures: trend.cultures.map((c) => c.culture),
})

export const createTrendDbInput = (input: TrendApiInput) => ({
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
    create: input.influencedByStyles.map((inf) => ({
      influencerId: inf.id,
      influenceType: inf.type,
    })),
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
})

export const addTrend = async (
  input: TrendApiInput
): Promise<TrendApiOutput> => {
  const trend = await prisma.trend.create({
    data: createTrendDbInput(input),
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
  return toApiOutput(trend)
}

export const getTrend = async (id: number): Promise<TrendApiOutput> => {
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
  return toApiOutput(trend)
}

export const getTrends = async (): Promise<TrendApiOutput[]> => {
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
  return trends.map(toApiOutput)
}

export const editTrend = async (
  id: number,
  input: TrendApiInput
): Promise<TrendApiOutput> => {
  const trend = await prisma.trend.update({
    where: { id: id },
    data: {
      ...input,
      alternateNames: {
        deleteMany: { trendId: id },
        create: input.alternateNames.map((name) => ({ name })),
      },
      parentTrends: {
        deleteMany: { childId: id },
        create: input.parentTrends.map((id) => ({ parentId: id })),
      },
      parentStyles: {
        deleteMany: { childId: id },
        create: input.parentStyles.map((id) => ({ parentId: id })),
      },
      parentMetas: {
        deleteMany: { childId: id },
        create: input.parentMetas.map((id) => ({ parentId: id })),
      },
      influencedByTrends: {
        deleteMany: { influencedId: id },
        create: input.influencedByTrends.map((id) => ({ influencerId: id })),
      },
      influencedByStyles: {
        deleteMany: { influencedId: id },
        create: input.influencedByStyles.map((inf) => ({
          influencerId: inf.id,
          influenceType: inf.type,
        })),
      },
      locations: {
        deleteMany: { trendId: id },
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
        deleteMany: { trendId: id },
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
  return toApiOutput(trend)
}

export const deleteTrend = async (id: number): Promise<number> => {
  await prisma.trend.delete({ where: { id } })
  return id
}

const trendsRouter = createRouter()
  .mutation('add', {
    input: TrendApiInput,
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
      data: TrendApiInput,
    }),
    resolve: ({ input }) => editTrend(input.id, input.data),
  })
  .mutation('delete', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => deleteTrend(input.id),
  })

export default trendsRouter
