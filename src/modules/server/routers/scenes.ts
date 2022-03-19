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
} from '../utils/validators/misc'

export const SceneApiInput = BaseGenreInput.extend({
  influencedByScenes: IdsInput,
  locations: LocationsInput,
  cultures: CulturesInput,
})
export type SceneApiInput = z.infer<typeof SceneApiInput>

export const TypedSceneApiInput = z.object({
  type: z.literal('scene'),
  data: SceneApiInput,
})

export type SceneApiOutput = Scene & {
  type: 'scene'
  alternateNames: string[]
  influencedByScenes: (Scene & { type: 'scene' })[]
  locations: Location[]
  cultures: Culture[]
}

const toApiOutput = (
  scene: Scene & {
    alternateNames: SceneName[]
    influencedByScenes: (SceneInfluence & { influencer: Scene })[]
    locations: (SceneLocation & { location: Location })[]
    cultures: (SceneCulture & { culture: Culture })[]
  }
): SceneApiOutput => ({
  ...scene,
  type: 'scene',
  alternateNames: scene.alternateNames.map((an) => an.name),
  influencedByScenes: scene.influencedByScenes.map((inf) => ({
    ...inf.influencer,
    type: 'scene',
  })),
  locations: scene.locations.map((loc) => loc.location),
  cultures: scene.cultures.map((c) => c.culture),
})

export const createSceneDbInput = (input: SceneApiInput) => ({
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
})

export const addScene = async (
  input: SceneApiInput
): Promise<SceneApiOutput> => {
  const scene = await prisma.scene.create({
    data: createSceneDbInput(input),
    include: {
      alternateNames: true,
      influencedByScenes: { include: { influencer: true } },
      locations: { include: { location: true } },
      cultures: { include: { culture: true } },
    },
  })
  return toApiOutput(scene)
}

export const getScene = async (id: number): Promise<SceneApiOutput> => {
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
  return toApiOutput(scene)
}

export const getScenes = async (): Promise<SceneApiOutput[]> => {
  const scenes = await prisma.scene.findMany({
    include: {
      alternateNames: true,
      influencedByScenes: { include: { influencer: true } },
      locations: { include: { location: true } },
      cultures: { include: { culture: true } },
    },
  })
  return scenes.map(toApiOutput)
}

export const editScene = async (
  id: number,
  input: SceneApiInput
): Promise<SceneApiOutput> => {
  const scene = await prisma.scene.update({
    where: { id: id },
    data: {
      ...input,
      alternateNames: {
        deleteMany: { sceneId: id },
        create: input.alternateNames.map((name) => ({ name })),
      },
      influencedByScenes: {
        deleteMany: { influencedId: id },
        create: input.influencedByScenes.map((id) => ({ influencerId: id })),
      },
      locations: {
        deleteMany: { sceneId: id },
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
        deleteMany: { sceneId: id },
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
  return toApiOutput(scene)
}

export const deleteScene = async (id: number): Promise<number> => {
  await prisma.scene.delete({ where: { id } })
  return id
}

const scenesRouter = createRouter()
  .mutation('add', {
    input: SceneApiInput,
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
      data: SceneApiInput,
    }),
    resolve: ({ input }) => editScene(input.id, input.data),
  })
  .mutation('delete', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => deleteScene(input.id),
  })

export default scenesRouter
