import {
  Culture,
  Location,
  Meta,
  Style,
  StyleCulture,
  StyleInfluence,
  StyleLocation,
  StyleMetaParent,
  StyleName,
  StyleStyleParent,
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

export const StyleInput = BaseGenreInput.extend({
  parentStyles: IdsInput,
  parentMetas: IdsInput,
  influencedByStyles: IdsInput,
  locations: LocationsInput,
  cultures: CulturesInput,
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

export const getStyles = async (): Promise<StyleOutput[]> => {
  const styles = await prisma.style.findMany({
    include: {
      alternateNames: true,
      parentStyles: { include: { parent: true } },
      parentMetas: { include: { parent: true } },
      influencedByStyles: { include: { influencer: true } },
      locations: { include: { location: true } },
      cultures: { include: { culture: true } },
    },
  })
  return styles.map(toOutput)
}

export const editStyle = async (
  id: number,
  data: StyleInput
): Promise<StyleOutput> => {
  const style = await prisma.style.update({
    where: { id: id },
    data: {
      ...data,
      alternateNames: {
        deleteMany: { styleId: id },
        create: data.alternateNames.map((name) => ({ name })),
      },
      parentStyles: {
        deleteMany: { childId: id },
        create: data.parentStyles.map((id) => ({ parentId: id })),
      },
      parentMetas: {
        deleteMany: { childId: id },
        create: data.parentMetas.map((id) => ({ parentId: id })),
      },
      influencedByStyles: {
        deleteMany: { influencedId: id },
        create: data.influencedByStyles.map((id) => ({ influencerId: id })),
      },
      locations: {
        deleteMany: { styleId: id },
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
        deleteMany: { styleId: id },
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
  await prisma.style.delete({ where: { id } })
  return id
}

const stylesRouter = createRouter()
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