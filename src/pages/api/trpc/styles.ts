import {
  Culture,
  Location,
  Meta,
  PrismaClient,
  Style,
  StyleCulture,
  StyleInfluence,
  StyleLocation,
  StyleMetaParent,
  StyleName,
  StyleStyleParent,
} from '@prisma/client'
import * as trpc from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const prisma = new PrismaClient()

export const StyleInput = z.object({
  name: z.string().min(1),
  shortDesc: z.string().min(1),
  longDesc: z.string().min(1),
  alternateNames: z.array(z.string()),
  parentStyles: z.array(z.number()),
  parentMetas: z.array(z.number()),
  influencedByStyles: z.array(z.number()),
  locations: z.array(
    z.object({ city: z.string(), region: z.string(), country: z.string() })
  ),
  cultures: z.array(z.string()),
})
export type StyleInput = z.infer<typeof StyleInput>

export type StyleOutput = Style & {
  type: 'style'
  alternateNames: string[]
  parentStyles: Style[]
  parentMetas: Meta[]
  influencedByStyles: Style[]
  locations: Location[]
  cultures: Culture[]
}

const toOutput = (
  style: Style & {
    alternateNames: StyleName[]
    parentStyles: (StyleStyleParent & { parent: Style })[]
    parentMetas: (StyleMetaParent & { parent: Meta })[]
    influencedByStyles: (StyleInfluence & { influencer: Style })[]
    locations: (StyleLocation & { location: Location })[]
    cultures: (StyleCulture & { culture: Culture })[]
  }
): StyleOutput => ({
  ...style,
  type: 'style',
  alternateNames: style.alternateNames.map((an) => an.name),
  parentStyles: style.parentStyles.map((p) => p.parent),
  parentMetas: style.parentMetas.map((p) => p.parent),
  influencedByStyles: style.influencedByStyles.map((inf) => inf.influencer),
  locations: style.locations.map((loc) => loc.location),
  cultures: style.cultures.map((c) => c.culture),
})

export const addStyle = async (input: StyleInput): Promise<StyleOutput> => {
  const style = await prisma.style.create({
    data: {
      ...input,
      alternateNames: {
        create: input.alternateNames.map((name) => ({ name })),
      },
      parentStyles: {
        create: input.parentStyles.map((id) => ({ parentId: id })),
      },
      parentMetas: {
        create: input.parentMetas.map((id) => ({ parentId: id })),
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
      parentStyles: { include: { parent: true } },
      parentMetas: { include: { parent: true } },
      influencedByStyles: { include: { influencer: true } },
      locations: { include: { location: true } },
      cultures: { include: { culture: true } },
    },
  })
  return toOutput(style)
}

export const getStyle = async (id: number): Promise<StyleOutput> => {
  const style = await prisma.style.findUnique({
    where: { id },
    include: {
      alternateNames: true,
      parentStyles: { include: { parent: true } },
      parentMetas: { include: { parent: true } },
      influencedByStyles: { include: { influencer: true } },
      locations: { include: { location: true } },
      cultures: { include: { culture: true } },
    },
  })
  if (!style) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No style with id '${id}'`,
    })
  }
  return toOutput(style)
}

export const editStyle = async (
  id: number,
  data: StyleInput
): Promise<StyleOutput> => {
  await prisma.styleName.deleteMany({ where: { styleId: id } })
  await prisma.styleStyleParent.deleteMany({ where: { childId: id } })
  await prisma.styleMetaParent.deleteMany({ where: { childId: id } })
  await prisma.styleInfluence.deleteMany({ where: { influencedId: id } })
  await prisma.styleLocation.deleteMany({ where: { styleId: id } })
  const style = await prisma.style.update({
    where: { id: id },
    data: {
      ...data,
      alternateNames: {
        create: data.alternateNames.map((name) => ({ name })),
      },
      parentStyles: {
        create: data.parentStyles.map((id) => ({ parentId: id })),
      },
      parentMetas: {
        create: data.parentMetas.map((id) => ({ parentId: id })),
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
      parentStyles: { include: { parent: true } },
      parentMetas: { include: { parent: true } },
      influencedByStyles: { include: { influencer: true } },
      locations: { include: { location: true } },
      cultures: { include: { culture: true } },
    },
  })
  return toOutput(style)
}

export const deleteStyle = async (id: number): Promise<number> => {
  const deleteNames = prisma.styleName.deleteMany({ where: { styleId: id } })
  const deleteStyleParents = prisma.styleStyleParent.deleteMany({
    where: { childId: id },
  })
  const deleteMetaParents = prisma.styleMetaParent.deleteMany({
    where: { childId: id },
  })
  const deleteStyleChildren = prisma.styleStyleParent.deleteMany({
    where: { parentId: id },
  })
  const deleteTrendChildren = prisma.trendStyleParent.deleteMany({
    where: { parentId: id },
  })
  const deleteInfluencesStyles = prisma.styleInfluence.deleteMany({
    where: { influencerId: id },
  })
  const deleteInfluencesTrends = prisma.trendStyleInfluence.deleteMany({
    where: { influencerId: id },
  })
  const deleteInfluencedByStyles = prisma.styleInfluence.deleteMany({
    where: { influencedId: id },
  })
  const deleteLocations = prisma.styleLocation.deleteMany({
    where: { styleId: id },
  })
  const deleteStyle = prisma.style.delete({ where: { id } })
  await prisma.$transaction([
    deleteNames,
    deleteStyleParents,
    deleteMetaParents,
    deleteStyleChildren,
    deleteTrendChildren,
    deleteInfluencesStyles,
    deleteInfluencedByStyles,
    deleteInfluencesTrends,
    deleteLocations,
    deleteStyle,
  ])
  return id
}

const stylesRouter = trpc
  .router()
  .mutation('add', {
    input: StyleInput,
    resolve: ({ input }) => addStyle(input),
  })
  .query('all', {
    resolve: async () => {
      const styles = await prisma.style.findMany()
      return styles
    },
  })
  .query('byId', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => getStyle(input.id),
  })
  .mutation('edit', {
    input: z.object({
      id: z.number(),
      data: StyleInput,
    }),
    resolve: ({ input }) => editStyle(input.id, input.data),
  })
  .mutation('delete', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => deleteStyle(input.id),
  })

export default stylesRouter
