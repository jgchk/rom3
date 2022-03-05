import { PrismaClient } from '@prisma/client'
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

export const addScene = (input: SceneInput) =>
  prisma.scene.create({
    data: {
      ...input,
      alternateNames: {
        create: input.alternateNames.map((name) => ({ name })),
      },
      influencedBy: { connect: input.influencedBy.map((id) => ({ id })) },
    },
  })

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
    resolve: async ({ input }) => {
      const scene = await prisma.scene.findUnique({ where: { id: input.id } })
      if (!scene) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No scene with id '${input.id}'`,
        })
      }
      return scene
    },
  })
  .mutation('edit', {
    input: SceneInput.extend({
      id: z.number(),
    }),
    resolve: async ({ input }) => {
      const scene = await prisma.scene.update({
        where: { id: input.id },
        data: {
          ...input,
          alternateNames: {
            create: input.alternateNames.map((name) => ({ name })),
          },
          influencedBy: { connect: input.influencedBy.map((id) => ({ id })) },
        },
      })
      return scene
    },
  })
  .mutation('delete', {
    input: z.object({ id: z.number() }),
    resolve: async ({ input }) => {
      await prisma.scene.delete({ where: { id: input.id } })
      return input.id
    },
  })

export default scenesRouter
