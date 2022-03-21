import {
  Culture,
  Genre,
  GenreCulture,
  GenreInfluence,
  GenreLocation,
  GenreName,
  GenreParent,
  Location,
} from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import createRouter from '../createRouter'
import prisma from '../prisma'

export const GenreType = z.union([
  z.literal('META'),
  z.literal('SCENE'),
  z.literal('STYLE'),
  z.literal('TREND'),
])

const ApiGenreParent = z.number()
type ApiGenreParent = z.infer<typeof ApiGenreParent>

export const ApiInfluenceType = z.union([
  z.literal('HISTORICAL'),
  z.literal('SONIC'),
])
const ApiGenreInfluence = z.object({
  id: z.number(),
  influenceType: ApiInfluenceType.optional(),
})
type ApiGenreInfluence = z.infer<typeof ApiGenreInfluence>

export const ApiLocation = z
  .object({ city: z.string(), region: z.string(), country: z.string() })
  .refine(
    (val) =>
      val.city.length > 0 || val.region.length > 0 || val.country.length > 0,
    { message: "Location can't be empty" }
  )
type ApiLocation = z.infer<typeof ApiLocation>

export const ApiCulture = z.string().min(1)
type ApiCulture = z.infer<typeof ApiCulture>

const GenreApiInput = z.object({
  type: GenreType,
  name: z.string().min(1),
  alternateNames: z.array(z.string().min(1)),
  shortDesc: z.string().min(1),
  longDesc: z.string().min(1),
  parents: z.number().array(),
  influencedBy: ApiGenreInfluence.array(),
  locations: ApiLocation.array(),
  cultures: ApiCulture.array(),
})
type GenreApiInput = z.infer<typeof GenreApiInput>

export type GenreApiOutput = Genre & {
  alternateNames: string[]
  parents: ApiGenreParent[]
  influencedBy: ApiGenreInfluence[]
  locations: ApiLocation[]
  cultures: ApiCulture[]
}

export type GenreInclude = Genre & {
  alternateNames: GenreName[]
  parents: GenreParent[]
  influencedBy: GenreInfluence[]
  locations: (GenreLocation & { location: Location })[]
  cultures: (GenreCulture & { culture: Culture })[]
}
export const genreInclude = {
  alternateNames: true,
  parents: true,
  influencedBy: true,
  locations: { include: { location: true } },
  cultures: { include: { culture: true } },
} as const

export const toGenreApiOutput = (genre: GenreInclude): GenreApiOutput => ({
  ...genre,
  alternateNames: genre.alternateNames.map((an) => an.name),
  parents: genre.parents.map((p) => p.parentId),
  influencedBy: genre.influencedBy.map((p) => ({
    id: p.influencerId,
    influenceType: p.influenceType ?? undefined,
  })),
  locations: genre.locations.map((loc) => loc.location),
  cultures: genre.cultures.map((c) => c.culture.name),
})

const addGenre = async (input: GenreApiInput): Promise<GenreApiOutput> => {
  const genre = await prisma.genre.create({
    data: {
      type: input.type,
      name: input.name,
      alternateNames: {
        create: input.alternateNames.map((name) => ({ name })),
      },
      shortDesc: input.shortDesc,
      longDesc: input.longDesc,
      parents: {
        create: input.parents.map((parentId) => ({ parentId })),
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
    },
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
    include: genreInclude,
  })
  return genres.map(toGenreApiOutput)
}

const editGenre = async (
  id: number,
  input: GenreApiInput
): Promise<GenreApiOutput> => {
  const genre = await prisma.genre.update({
    where: { id },
    data: {
      type: input.type,
      name: input.name,
      alternateNames: {
        deleteMany: { genreId: id },
        create: input.alternateNames.map((name) => ({ name })),
      },
      shortDesc: input.shortDesc,
      longDesc: input.longDesc,
      parents: {
        deleteMany: { childId: id },
        create: input.parents.map((parentId) => ({ parentId })),
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
    },
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
  .query('all', {
    resolve: async () => getGenres(),
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
