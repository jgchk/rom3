import { Meta, MetaName, MetaParent } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import createRouter from '../createRouter'
import prisma from '../prisma'
import { BaseGenreInput, IdsInput } from '../utils/validators/misc'

export const MetaApiInput = BaseGenreInput.extend({
  parentMetas: IdsInput,
})
export type MetaApiInput = z.infer<typeof MetaApiInput>

export const TypedMetaApiInput = z.object({
  type: z.literal('meta'),
  data: MetaApiInput,
})

export type MetaApiOutput = Meta & {
  type: 'meta'
  alternateNames: string[]
  parentMetas: (Meta & { type: 'meta' })[]
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
  parentMetas: meta.parentMetas.map((p) => ({ ...p.parent, type: 'meta' })),
})

export const createMetaDbInput = (input: MetaApiInput) => ({
  ...input,
  alternateNames: {
    create: input.alternateNames.map((name) => ({ name })),
  },
  parentMetas: {
    create: input.parentMetas.map((id) => ({ parentId: id })),
  },
})

export const addMeta = async (input: MetaApiInput): Promise<MetaApiOutput> => {
  const meta = await prisma.meta.create({
    data: createMetaDbInput(input),
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
  input: MetaApiInput
): Promise<MetaApiOutput> => {
  const meta = await prisma.meta.update({
    where: { id: id },
    data: {
      ...input,
      alternateNames: {
        deleteMany: { metaId: id },
        create: input.alternateNames.map((name) => ({ name })),
      },
      parentMetas: {
        deleteMany: { childId: id },
        create: input.parentMetas.map((parentId) => ({ parentId })),
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
