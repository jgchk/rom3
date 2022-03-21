import { z } from 'zod'

import createRouter from '../createRouter'
import prisma from '../prisma'
import { ApiCulture, ApiInfluenceType, ApiLocation, GenreType } from './genres'

const CorrectionIdApiInput = z.object({
  id: z.number(),
  type: z.union([z.literal('created'), z.literal('exists')]),
})

const CorrectionGenreInfluenceApiInput = CorrectionIdApiInput.extend({
  influenceType: ApiInfluenceType.optional(),
})

const CorrectionGenreApiInput = z.object({
  type: GenreType,
  name: z.string().min(1),
  alternateNames: z.array(z.string().min(1)),
  shortDesc: z.string().min(1),
  longDesc: z.string().min(1),
  parents: CorrectionIdApiInput.array(),
  influencedBy: CorrectionGenreInfluenceApiInput.array(),
  locations: ApiLocation.array(),
  cultures: ApiCulture.array(),
})

const GenreCreateApiInput = z.object({
  id: z.number(),
  data: CorrectionGenreApiInput,
})

const GenreEditApiInput = z.object({
  id: z.number(),
  data: CorrectionGenreApiInput,
})

const GenreDeleteApiInput = z.number()

const CorrectionApiInput = z.object({
  create: GenreCreateApiInput.array(),
  edit: GenreEditApiInput.array(),
  delete: GenreDeleteApiInput.array(),
})
type CorrectionApiInput = z.infer<typeof CorrectionApiInput>

const addCorrection = async (input: CorrectionApiInput) => {
  // 1. create without relationships -> make map from input ids to real ids
  // 2. add relationships using real ids

  const idsMap: { [inputId: number]: number } = {}

  for (const { id: inputId, data } of input.create) {
    const { id: realId } = await prisma.genre.create({
      data: {
        type: data.type,
        name: data.name,
        alternateNames: {
          create: data.alternateNames.map((name) => ({ name })),
        },
        shortDesc: data.shortDesc,
        longDesc: data.longDesc,
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
    })

    idsMap[inputId] = realId
  }

  for (const { id: inputId, data } of input.create) {
    const realId = idsMap[inputId]
    await prisma.genre.update({
      where: { id: realId },
      data: {
        parents: {
          create: data.parents.map((parent) => ({
            parentId: parent.type === 'exists' ? parent.id : idsMap[parent.id],
          })),
        },
        influencedBy: {
          create: data.influencedBy.map((influence) => ({
            influencerId:
              influence.type === 'exists' ? influence.id : idsMap[influence.id],
            influenceType: influence.influenceType,
          })),
        },
      },
    })
  }

  const correction = await prisma.correction.create({
    data: {
      create: {
        create: input.create.map((c) => ({ createdGenreId: idsMap[c.id] })),
      },
      edit: {
        create: input.edit.map((e) => ({
          targetGenre: {
            connect: e.id,
          },
          updatedGenre: {
            create: {
              type: e.data.type,
              name: e.data.name,
              alternateNames: {
                create: e.data.alternateNames.map((name) => ({ name })),
              },
              shortDesc: e.data.shortDesc,
              longDesc: e.data.longDesc,
              parents: {
                create: e.data.parents.map((parent) => ({
                  parentId:
                    parent.type === 'exists' ? parent.id : idsMap[parent.id],
                })),
              },
              influencedBy: {
                create: e.data.influencedBy.map((influence) => ({
                  influencerId:
                    influence.type === 'exists'
                      ? influence.id
                      : idsMap[influence.id],
                  influenceType: influence.influenceType,
                })),
              },
              locations: {
                create: e.data.locations.map((loc) => ({
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
                create: e.data.cultures.map((c) => ({
                  culture: {
                    connectOrCreate: {
                      where: { name: c },
                      create: { name: c },
                    },
                  },
                })),
              },
            },
          },
        })),
      },
      delete: {
        create: input.delete.map((id) => ({ targetGenreId: id })),
      },
    },
  })

  return correction
}

const correctionsRouter = createRouter().mutation('add', {
  input: CorrectionApiInput,
  resolve: ({ input }) => addCorrection(input),
})

export default correctionsRouter
