import { PrismaClient, Scene, SceneName } from '@prisma/client'
import * as trpc from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const prisma = new PrismaClient()

export const SceneInput = z.object({
  name: z.string().min(1),
  shortDesc: z.string().min(1),
  longDesc: z.string().min(1),
  alternateNames: z.array(z.string()),
  influencedBy: z.array(z.number()),
})
export type SceneInput = z.infer<typeof SceneInput>

export type SceneOutput = Scene & {
  type: 'scene'
  alternateNames: string[]
  influencedBy: Scene[]
}

const toOutput = (
  scene: Scene & {
    alternateNames: SceneName[]
    influencedBy: Scene[]
  }
): SceneOutput => ({
  ...scene,
  type: 'scene',
  alternateNames: scene.alternateNames.map((an) => an.name),
})

export const addScene = async (input: SceneInput): Promise<SceneOutput> => {
  const scene = await prisma.scene.create({
    data: {
      ...input,
      alternateNames: {
        create: input.alternateNames.map((name) => ({ name })),
      },
      influencedBy: { connect: input.influencedBy.map((id) => ({ id })) },
    },
    include: { alternateNames: true, influencedBy: true },
  })
  return toOutput(scene)
}

export const getScene = async (id: number): Promise<SceneOutput> => {
  const scene = await prisma.scene.findUnique({
    where: { id },
    include: { alternateNames: true, influencedBy: true },
  })
  if (!scene) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No scene with id '${id}'`,
    })
  }
  return toOutput(scene)
}

export const editScene = async (
  id: number,
  data: SceneInput
): Promise<SceneOutput> => {
  await prisma.sceneName.deleteMany({ where: { sceneId: id } })
  const scene = await prisma.scene.update({
    where: { id: id },
    data: {
      ...data,
      alternateNames: {
        create: data.alternateNames.map((name) => ({ name })),
      },
      influencedBy: { set: data.influencedBy.map((id) => ({ id })) },
    },
    include: { alternateNames: true, influencedBy: true },
  })
  return toOutput(scene)
}

const scenesRouter = trpc
  .router()
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
    resolve: async ({ input }) => {
      await prisma.scene.delete({ where: { id: input.id } })
      return input.id
    },
  })

export default scenesRouter
