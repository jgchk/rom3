import { Meta, MetaName, MetaParent, PrismaClient } from '@prisma/client'
import * as trpc from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

// TODO: use only 1 prisma client
const prisma = new PrismaClient()

export const MetaInput = z.object({
  name: z.string().min(1),
  shortDesc: z.string().min(1),
  longDesc: z.string().min(1),
  alternateNames: z.array(z.string()),
  parentMetas: z.array(z.number()),
})
export type MetaInput = z.infer<typeof MetaInput>

export type MetaOutput = Meta & {
  type: 'meta'
  alternateNames: string[]
  parentMetas: Meta[]
}

const toOutput = (
  meta: Meta & {
    alternateNames: MetaName[]
    parentMetas: (MetaParent & { parent: Meta })[]
  }
): MetaOutput => ({
  ...meta,
  type: 'meta',
  alternateNames: meta.alternateNames.map((an) => an.name),
  parentMetas: meta.parentMetas.map((p) => p.parent),
})

export const addMeta = async (input: MetaInput): Promise<MetaOutput> => {
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
  return toOutput(meta)
}

export const getMeta = async (id: number): Promise<MetaOutput> => {
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
  return toOutput(meta)
}

export const getMetas = async (): Promise<MetaOutput[]> => {
  const metas = await prisma.meta.findMany({
    include: {
      alternateNames: true,
      parentMetas: { include: { parent: true } },
    },
  })
  return metas.map(toOutput)
}

export const editMeta = async (
  id: number,
  data: MetaInput
): Promise<MetaOutput> => {
  await prisma.metaName.deleteMany({ where: { metaId: id } })
  await prisma.metaParent.deleteMany({ where: { childId: id } })
  const meta = await prisma.meta.update({
    where: { id: id },
    data: {
      ...data,
      alternateNames: {
        create: data.alternateNames.map((name) => ({ name })),
      },
      parentMetas: {
        create: data.parentMetas.map((id) => ({ parentId: id })),
      },
    },
    include: {
      alternateNames: true,
      parentMetas: { include: { parent: true } },
    },
  })
  return toOutput(meta)
}

export const deleteMeta = async (id: number): Promise<number> => {
  const deleteNames = prisma.metaName.deleteMany({ where: { metaId: id } })
  const deleteMetaParents = prisma.metaParent.deleteMany({
    where: { childId: id },
  })
  const deleteMetaChildren = prisma.metaParent.deleteMany({
    where: { parentId: id },
  })
  const deleteStyleChildren = prisma.styleStyleParent.deleteMany({
    where: { parentId: id },
  })
  const deleteTrendChildren = prisma.trendStyleParent.deleteMany({
    where: { parentId: id },
  })
  const deleteMeta = prisma.style.delete({ where: { id } })
  await prisma.$transaction([
    deleteNames,
    deleteMetaParents,
    deleteMetaChildren,
    deleteStyleChildren,
    deleteTrendChildren,
    deleteMeta,
  ])
  return id
}

const metasRouter = trpc
  .router()
  .mutation('add', {
    input: MetaInput,
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
      data: MetaInput,
    }),
    resolve: ({ input }) => editMeta(input.id, input.data),
  })
  .mutation('delete', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => deleteMeta(input.id),
  })

export default metasRouter
