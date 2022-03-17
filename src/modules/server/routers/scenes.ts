import {
  Culture,
  Location,
  Scene,
  SceneCulture,
  SceneInfluence,
  SceneLocation,
  SceneName,
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

export const SceneInput = BaseGenreInput.extend({
  influencedByScenes: IdsInput,
  locations: LocationsInput,
  cultures: CulturesInput,
})
export type SceneInput = z.infer<typeof SceneInput>

export type SceneOutput = Scene & {
  type: 'scene'
  alternateNames: string[]
  influencedByScenes: Scene[]
  locations: Location[]
  cultures: Culture[]
}

const toOutput = (
  scene: Scene & {
    alternateNames: SceneName[]
    influencedByScenes: (SceneInfluence & { influencer: Scene })[]
    locations: (SceneLocation & { location: Location })[]
    cultures: (SceneCulture & { culture: Culture })[]
  }
): SceneOutput => ({
  ...scene,
  type: 'scene',
  alternateNames: scene.alternateNames.map((an) => an.name),
  influencedByScenes: scene.influencedByScenes.map((inf) => inf.influencer),
  locations: scene.locations.map((loc) => loc.location),
  cultures: scene.cultures.map((c) => c.culture),
})

export const addScene = async (input: SceneInput): Promise<SceneOutput> => {
  const scene = await prisma.scene.create({
    data: {
      ...input,
      alternateNames: {
        create: input.alternateNames.map((name) => ({ name })),
      },
      influencedByScenes: {
        create: input.influencedByScenes.map((id) => ({ influencerId: id })),
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
      influencedByScenes: { include: { influencer: true } },
      locations: { include: { location: true } },
      cultures: { include: { culture: true } },
    },
  })
  return toOutput(scene)
}

export const getScene = async (id: number): Promise<SceneOutput> => {
  const scene = await prisma.scene.findUnique({
    where: { id },
    include: {
      alternateNames: true,
      influencedByScenes: { include: { influencer: true } },
      locations: { include: { location: true } },
      cultures: { include: { culture: true } },
    },
  })
  if (!scene) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No scene with id '${id}'`,
    })
  }
  return toOutput(scene)
}

export const getScenes = async (): Promise<SceneOutput[]> => {
  const scenes = await prisma.scene.findMany({
    include: {
      alternateNames: true,
      influencedByScenes: { include: { influencer: true } },
      locations: { include: { location: true } },
      cultures: { include: { culture: true } },
    },
  })
  return scenes.map(toOutput)
}

export const editScene = async (
  id: number,
  data: SceneInput
): Promise<SceneOutput> => {
  const scene = await prisma.scene.update({
    where: { id: id },
    data: {
      ...data,
      alternateNames: {
        deleteMany: { sceneId: id },
        create: data.alternateNames.map((name) => ({ name })),
      },
      influencedByScenes: {
        deleteMany: { influencedId: id },
        create: data.influencedByScenes.map((id) => ({ influencerId: id })),
      },
      locations: {
        deleteMany: { sceneId: id },
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
        deleteMany: { sceneId: id },
        create: data.cultures.map((c) => ({
          culture: {
            connectOrCreate: { where: { name: c }, create: { name: c } },
          },
        })),
      },
    },
    include: {
      alternateNames: true,
      influencedByScenes: { include: { influencer: true } },
      locations: { include: { location: true } },
      cultures: { include: { culture: true } },
    },
  })
  return toOutput(scene)
}

export const deleteScene = async (id: number): Promise<number> => {
  await prisma.scene.delete({ where: { id } })
  return id
}

const scenesRouter = createRouter()
  .mutation('add', {
    input: SceneInput,
    resolve: ({ input }) => addScene(input),
  })
  .query('all', {
    resolve: async () => {
      const scenes = await prisma.scene.findMany()
      return scenes
    },
  })
  .query('byId', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => getScene(input.id),
  })
  .mutation('edit', {
    input: z.object({
      id: z.number(),
      data: SceneInput,
    }),
    resolve: ({ input }) => editScene(input.id, input.data),
  })
  .mutation('delete', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => deleteScene(input.id),
  })

export default scenesRouter