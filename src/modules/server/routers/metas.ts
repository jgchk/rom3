import { Meta, MetaName, MetaParent } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import createRouter from '../createRouter'
import prisma from '../prisma'
import { BaseGenreInput, IdsInput } from '../utils/validators'

export const MetaApiInput = BaseGenreInput.extend({
  parentMetas: IdsInput,
})
export type MetaApiInput = z.infer<typeof MetaApiInput>

export type MetaApiOutput = Meta & {
  type: 'meta'
  alternateNames: string[]
  parentMetas: Meta[]
}

const toApiOutput = (
  meta: Meta & {
    alternateNames: MetaName[]
    parentMetas: (MetaParent & { parent: Meta })[]
  }
): MetaApiOutput => ({
  ...meta,
  type: 'meta',
  alternateNames: meta.alternateNames.map((an) => an.name),
  parentMetas: meta.parentMetas.map((p) => p.parent),
})

export const addMeta = async (input: MetaApiInput): Promise<MetaApiOutput> => {
  const meta = await prisma.meta.create({
    data: {
      ...input,
      alternateNames: {
        create: input.alternateNames.map((name) => ({ name })),
      },
      parentMetas: {
        create: input.parentMetas.map((id) => ({ parentId: id })),
      },
    },
    include: {
      alternateNames: true,
      parentMetas: { include: { parent: true } },
    },
  })
  return toApiOutput(meta)
}

export const getMeta = async (id: number): Promise<MetaApiOutput> => {
  const meta = await prisma.meta.findUnique({
    where: { id },
    include: {
      alternateNames: true,
      parentMetas: { include: { parent: true } },
    },
  })
  if (!meta) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No meta with id '${id}'`,
    })
  }
  return toApiOutput(meta)
}

export const getMetas = async (): Promise<MetaApiOutput[]> => {
  const metas = await prisma.meta.findMany({
    include: {
      alternateNames: true,
      parentMetas: { include: { parent: true } },
    },
  })
  return metas.map(toApiOutput)
}

export const editMeta = async (
  id: number,
  data: MetaApiInput
): Promise<MetaApiOutput> => {
  const meta = await prisma.meta.update({
    where: { id: id },
    data: {
      ...data,
      alternateNames: {
        deleteMany: { metaId: id },
        create: data.alternateNames.map((name) => ({ name })),
      },
      parentMetas: {
        deleteMany: { childId: id },
        create: data.parentMetas.map((parentId) => ({ parentId })),
      },
    },
    include: {
      alternateNames: true,
      parentMetas: { include: { parent: true } },
    },
  })
  return toApiOutput(meta)
}

export const deleteMeta = async (id: number): Promise<number> => {
  await prisma.meta.delete({ where: { id } })
  return id
}

const metasRouter = createRouter()
  .mutation('add', {
    input: MetaApiInput,
    resolve: ({ input }) => addMeta(input),
  })
  .query('all', {
    resolve: async () => {
      const styles = await prisma.meta.findMany()
      return styles
    },
  })
  .query('byId', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => getMeta(input.id),
  })
  .mutation('edit', {
    input: z.object({
      id: z.number(),
      data: MetaApiInput,
    }),
    resolve: ({ input }) => editMeta(input.id, input.data),
  })
  .mutation('delete', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => deleteMeta(input.id),
  })

export default metasRouter
