import {
  Culture,
  Genre,
  GenreCulture,
  GenreInfluence,
  GenreLocation,
  GenreName,
  GenreParent,
  Location,
  Prisma,
} from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { genreInfluencedByTypes } from '../../../common/model/influences'
import {
  genreChildTypes,
  genreParentTypes,
} from '../../../common/model/parents'
import { isNotNull } from '../../../common/utils/types'
import createRouter from '../createRouter'
import prisma from '../prisma'

export const GenreType = z.union([
  z.literal('META'),
  z.literal('SCENE'),
  z.literal('STYLE'),
  z.literal('TREND'),
])

export const ApiInfluenceType = z.union([
  z.literal('HISTORICAL'),
  z.literal('SONIC'),
])
export type ApiInfluenceType = z.infer<typeof ApiInfluenceType>
export const ApiGenreInfluence = z.object({
  id: z.number(),
  influenceType: ApiInfluenceType.optional(),
})
export type ApiGenreInfluence = z.infer<typeof ApiGenreInfluence>

export const ApiLocation = z.object({
  city: z.string(),
  region: z.string(),
  country: z.string(),
})
type ApiLocation = z.infer<typeof ApiLocation>

export const GenreApiInput = z.object({
  type: GenreType,
  name: z.string().min(1),
  alternateNames: z.array(z.string()),
  shortDesc: z.string().optional(),
  longDesc: z.string().optional(),
  trial: z.boolean(),
  parents: z.number().array(),
  children: z.number().array(),
  influencedBy: ApiGenreInfluence.array(),
  locations: ApiLocation.array(),
  cultures: z.string().array(),
})
export type GenreApiInput = z.infer<typeof GenreApiInput>

export type GenreApiOutput = Omit<Genre, 'shortDesc' | 'longDesc'> & {
  alternateNames: string[]
  shortDesc: string | undefined
  longDesc: string | undefined
  parents: number[]
  children: number[]
  influencedBy: ApiGenreInfluence[]
  influences: ApiGenreInfluence[]
  locations: ApiLocation[]
  cultures: string[]
}

const nonCorrectionGenreFilter = {
  createdInCorrection: null,
  editedInCorrection: null,
} as const

export type GenreInclude = Genre & {
  alternateNames: GenreName[]
  parents: GenreParent[]
  children: GenreParent[]
  influencedBy: GenreInfluence[]
  influences: GenreInfluence[]
  locations: (GenreLocation & { location: Location })[]
  cultures: (GenreCulture & { culture: Culture })[]
}
export const genreInclude = {
  alternateNames: true,
  parents: { where: { parent: nonCorrectionGenreFilter } },
  children: { where: { child: nonCorrectionGenreFilter } },
  influencedBy: { where: { influencer: nonCorrectionGenreFilter } },
  influences: { where: { influenced: nonCorrectionGenreFilter } },
  locations: { include: { location: true } },
  cultures: { include: { culture: true } },
} as const

const cleanInput = async (input: GenreApiInput): Promise<GenreApiInput> => {
  const shortDesc =
    input.shortDesc && input.shortDesc.length > 0 ? input.shortDesc : undefined
  const longDesc =
    input.longDesc && input.longDesc.length > 0 ? input.longDesc : undefined

  const parentTypes = genreParentTypes[input.type]
  const dbParents = await prisma.genre.findMany({
    where: { id: { in: input.parents } },
  })
  const parents = dbParents
    .filter((parent) => parentTypes.includes(parent.type))
    .map((parent) => parent.id)

  const childTypes = genreChildTypes[input.type]
  const dbChildren = await prisma.genre.findMany({
    where: { id: { in: input.children } },
  })
  const children = dbChildren
    .filter((child) => childTypes.includes(child.type))
    .map((child) => child.id)

  const influenceTypes = genreInfluencedByTypes[input.type]
  const dbInfluences = await Promise.all(
    input.influencedBy.map(async (inf) => {
      const influencer = await prisma.genre.findUnique({
        where: { id: inf.id },
      })
      if (influencer === null) return null
      return { influencer, influenceType: inf.influenceType }
    })
  )
  const influencedBy = dbInfluences
    .filter(isNotNull)
    .filter((inf) => influenceTypes.includes(inf.influencer.type))
    .map((inf) => ({
      id: inf.influencer.id,
      influenceType:
        inf.influencer.type === 'STYLE'
          ? inf.influenceType ?? 'HISTORICAL'
          : undefined,
    }))

  const cultures =
    input.type === 'META' ? [] : input.cultures.filter((s) => s.length > 0)
  const locations =
    input.type === 'META'
      ? []
      : // filter out empty locations
        input.locations.filter(
          (loc) =>
            !(
              loc.city.length === 0 &&
              loc.region.length === 0 &&
              loc.country.length === 0
            )
        )

  return {
    ...input,
    shortDesc,
    longDesc,
    parents,
    children,
    influencedBy,
    alternateNames: input.alternateNames.filter((s) => s.length > 0),
    cultures,
    locations,
  }
}

export const dbGenreCreateInput = async (
  data: GenreApiInput
): Promise<Prisma.GenreCreateInput> => {
  const input = await cleanInput(data)
  return {
    type: input.type,
    name: input.name,
    alternateNames: {
      create: input.alternateNames.map((name) => ({ name })),
    },
    shortDesc: input.shortDesc,
    longDesc: input.longDesc,
    trial: input.trial,
    parents: {
      create: input.parents.map((parentId) => ({ parentId })),
    },
    children: {
      create: input.children.map((childId) => ({ childId })),
    },
    influencedBy: {
      create: input.influencedBy.map(({ id, influenceType }) => ({
        influencerId: id,
        influenceType,
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
  }
}

export const dbGenreUpdateInput = async (
  id: number,
  data: GenreApiInput
): Promise<Prisma.GenreUpdateInput> => {
  const input = await cleanInput(data)
  return {
    type: input.type,
    name: input.name,
    alternateNames: {
      deleteMany: { genreId: id },
      create: input.alternateNames.map((name) => ({ name })),
    },
    shortDesc: input.shortDesc,
    longDesc: input.longDesc,
    trial: input.trial,
    parents: {
      deleteMany: { childId: id },
      create: input.parents.map((parentId) => ({ parentId })),
    },
    children: {
      deleteMany: { parentId: id },
      create: input.children.map((childId) => ({ childId })),
    },
    influencedBy: {
      deleteMany: { influencedId: id },
      create: input.influencedBy.map(({ id, influenceType }) => ({
        influencerId: id,
        influenceType,
      })),
    },
    locations: {
      deleteMany: { genreId: id },
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
      deleteMany: { genreId: id },
      create: input.cultures.map((c) => ({
        culture: {
          connectOrCreate: { where: { name: c }, create: { name: c } },
        },
      })),
    },
  }
}

export const toGenreApiOutput = (genre: GenreInclude): GenreApiOutput => ({
  ...genre,
  alternateNames: genre.alternateNames.map((an) => an.name),
  shortDesc: genre.shortDesc ?? undefined,
  longDesc: genre.longDesc ?? undefined,
  parents: genre.parents.map((p) => p.parentId),
  children: genre.children.map((p) => p.childId),
  influencedBy: genre.influencedBy.map((inf) => ({
    id: inf.influencerId,
    influenceType: inf.influenceType ?? undefined,
  })),
  influences: genre.influences.map((inf) => ({
    id: inf.influencedId,
    influenceType: inf.influenceType ?? undefined,
  })),
  locations: genre.locations.map((loc) => loc.location),
  cultures: genre.cultures.map((c) => c.culture.name),
})

const addGenre = async (input: GenreApiInput): Promise<GenreApiOutput> => {
  const data = await dbGenreCreateInput(input)
  const genre = await prisma.genre.create({
    data,
    include: genreInclude,
  })
  return toGenreApiOutput(genre)
}

const getGenre = async (id: number): Promise<GenreApiOutput> => {
  const genre = await prisma.genre.findUnique({
    where: { id },
    include: genreInclude,
  })
  if (!genre) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No genre with id '${id}'`,
    })
  }
  return toGenreApiOutput(genre)
}

const getGenres = async (): Promise<GenreApiOutput[]> => {
  const genres = await prisma.genre.findMany({
    where: nonCorrectionGenreFilter,
    include: genreInclude,
  })
  return genres.map(toGenreApiOutput)
}

const getTopLevelGenres = async (): Promise<GenreApiOutput[]> => {
  const genres = await prisma.genre.findMany({
    where: {
      parents: { none: {} },
      createdInCorrection: null,
      editedInCorrection: null,
    },
    include: genreInclude,
  })
  return genres.map(toGenreApiOutput)
}

const editGenre = async (
  id: number,
  input: GenreApiInput
): Promise<GenreApiOutput> => {
  const data = await dbGenreUpdateInput(id, input)
  const genre = await prisma.genre.update({
    where: { id },
    data,
    include: genreInclude,
  })
  return toGenreApiOutput(genre)
}

const deleteGenre = async (id: number): Promise<number> => {
  await prisma.genre.delete({ where: { id } })
  return id
}

const genresRouter = createRouter()
  .mutation('add', {
    input: GenreApiInput,
    resolve: ({ input }) => addGenre(input),
  })
  .query('list', {
    input: z.object({ topLevel: z.boolean() }).optional(),
    resolve: async ({ input }) =>
      input?.topLevel ? getTopLevelGenres() : getGenres(),
  })
  .query('byId', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => getGenre(input.id),
  })
  .mutation('edit', {
    input: z.object({ id: z.number(), data: GenreApiInput }),
    resolve: ({ input }) => editGenre(input.id, input.data),
  })
  .mutation('delete', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => deleteGenre(input.id),
  })

export default genresRouter
