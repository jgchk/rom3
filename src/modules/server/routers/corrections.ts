import {
  Correction,
  GenreCreate,
  GenreDelete,
  GenreEdit,
  Prisma,
} from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import createRouter from '../createRouter'
import prisma from '../prisma'
import {
  dbGenreCreateInput,
  dbGenreUpdateInput,
  GenreApiInput,
  GenreApiOutput,
  GenreInclude,
  genreInclude,
  toGenreApiOutput,
} from './genres'

type CorrectionApiOutput = Correction & {
  create: GenreApiOutput[]
  edit: { updatedGenre: GenreApiOutput; targetGenre: GenreApiOutput }[]
  delete: GenreApiOutput[]
}

type CorrectionInclude = Correction & {
  create: (GenreCreate & { createdGenre: GenreInclude })[]
  edit: (GenreEdit & {
    updatedGenre: GenreInclude
    targetGenre: GenreInclude
  })[]
  delete: (GenreDelete & { targetGenre: GenreInclude })[]
}
const correctionGenreFilter: Prisma.GenreWhereInput = {
  editedInCorrection: null,
}
const correctionGenreInclude = {
  ...genreInclude,
  parents: {
    where: {
      parent: correctionGenreFilter,
    },
  },
  children: {
    where: {
      child: correctionGenreFilter,
    },
  },
  influencedBy: {
    where: {
      influencer: correctionGenreFilter,
    },
  },
  influences: {
    where: {
      influenced: correctionGenreFilter,
    },
  },
} as const
const correctionInclude = {
  create: {
    include: {
      createdGenre: { include: correctionGenreInclude },
    },
  },
  edit: {
    include: {
      updatedGenre: { include: correctionGenreInclude },
      targetGenre: { include: correctionGenreInclude },
    },
  },
  delete: {
    include: {
      targetGenre: { include: correctionGenreInclude },
    },
  },
} as const

const toCorrectionApiOutput = (
  correction: CorrectionInclude
): CorrectionApiOutput => ({
  ...correction,
  create: correction.create.map((c) => toGenreApiOutput(c.createdGenre)),
  edit: correction.edit.map((e) => ({
    updatedGenre: toGenreApiOutput(e.updatedGenre),
    targetGenre: toGenreApiOutput(e.targetGenre),
  })),
  delete: correction.delete.map((d) => toGenreApiOutput(d.targetGenre)),
})

const addCorrection = async (
  creatorId: number
): Promise<CorrectionApiOutput> => {
  const correction = await prisma.correction.create({
    data: { creatorId, draft: true },
    include: correctionInclude,
  })
  return toCorrectionApiOutput(correction)
}

const addCreatedGenre = async (
  correctionId: number,
  input: GenreApiInput
): Promise<{ correction: CorrectionApiOutput; genreId: number }> => {
  const createdGenreData = await dbGenreCreateInput(input)
  const genre = await prisma.genre.create({
    data: {
      ...createdGenreData,
      createdInCorrection: {
        create: {
          correctionId,
        },
      },
    },
  })
  const correction = await prisma.correction.update({
    where: { id: correctionId },
    data: {
      updatedAt: new Date(),
    },
    include: correctionInclude,
  })
  return { correction: toCorrectionApiOutput(correction), genreId: genre.id }
}

const updateCreatedGenre = async (
  correctionId: number,
  createdGenreId: number,
  input: GenreApiInput
): Promise<CorrectionApiOutput> => {
  const createdGenreData = await dbGenreUpdateInput(createdGenreId, input)
  const correction = await prisma.correction.update({
    where: { id: correctionId },
    data: {
      create: {
        update: {
          where: { createdGenreId },
          data: {
            createdGenre: {
              update: createdGenreData,
            },
          },
        },
      },
      updatedAt: new Date(),
    },
    include: correctionInclude,
  })
  return toCorrectionApiOutput(correction)
}

const removeCreatedGenre = async (
  correctionId: number,
  createdGenreId: number
): Promise<CorrectionApiOutput> => {
  await prisma.genre.delete({ where: { id: createdGenreId } })
  const correction = await prisma.correction.update({
    where: { id: correctionId },
    data: {
      updatedAt: new Date(),
    },
    include: correctionInclude,
  })
  return toCorrectionApiOutput(correction)
}

const addEditedGenre = async (
  correctionId: number,
  targetGenreId: number,
  input: GenreApiInput
): Promise<CorrectionApiOutput> => {
  const updatedGenreData = await dbGenreCreateInput(input)
  const correction = await prisma.correction.update({
    where: { id: correctionId },
    data: {
      edit: {
        create: {
          targetGenre: {
            connect: {
              id: targetGenreId,
            },
          },
          updatedGenre: {
            create: updatedGenreData,
          },
        },
      },
      updatedAt: new Date(),
    },
    include: correctionInclude,
  })
  return toCorrectionApiOutput(correction)
}

const updateGenre = async (
  correctionId: number,
  genreId: number,
  data: GenreApiInput
): Promise<CorrectionApiOutput> => {
  const correction = await getCorrection(correctionId)

  const createdId = correction.create.find((e) => e.id === genreId)?.id
  if (createdId !== undefined)
    return updateCreatedGenre(correctionId, createdId, data)

  const editedId = correction.edit.find((e) => e.targetGenre.id === genreId)
    ?.updatedGenre.id
  if (editedId !== undefined)
    return updateEditedGenre(correctionId, genreId, editedId, data)

  return addEditedGenre(correctionId, genreId, data)
}

const updateEditedGenre = async (
  correctionId: number,
  targetGenreId: number,
  updatedGenreId: number,
  input: GenreApiInput
): Promise<CorrectionApiOutput> => {
  const updatedGenreData = await dbGenreUpdateInput(updatedGenreId, input)
  const correction = await prisma.correction.update({
    where: { id: correctionId },
    data: {
      edit: {
        update: {
          where: {
            correctionId_targetGenreId: {
              correctionId,
              targetGenreId,
            },
          },
          data: {
            updatedGenre: {
              update: updatedGenreData,
            },
          },
        },
      },
      updatedAt: new Date(),
    },
    include: correctionInclude,
  })
  return toCorrectionApiOutput(correction)
}

const removeEditedGenre = async (
  correctionId: number,
  updatedGenreId: number
): Promise<CorrectionApiOutput> => {
  await prisma.genre.delete({ where: { id: updatedGenreId } })
  const correction = await prisma.correction.update({
    where: { id: correctionId },
    data: {
      updatedAt: new Date(),
    },
    include: correctionInclude,
  })
  return toCorrectionApiOutput(correction)
}

const removeGenre = async (
  correctionId: number,
  targetGenreId: number
): Promise<CorrectionApiOutput> => {
  const correction = await getCorrection(correctionId)
  return correction.create.some((genre) => genre.id === targetGenreId)
    ? removeCreatedGenre(correctionId, targetGenreId)
    : addDeletedGenre(correctionId, targetGenreId)
}

const addDeletedGenre = async (
  correctionId: number,
  targetGenreId: number
): Promise<CorrectionApiOutput> => {
  const correction = await prisma.correction.update({
    where: { id: correctionId },
    data: {
      delete: {
        create: { targetGenreId },
      },
      updatedAt: new Date(),
    },
    include: correctionInclude,
  })
  return toCorrectionApiOutput(correction)
}

const removeDeletedGenre = async (
  correctionId: number,
  targetGenreId: number
): Promise<CorrectionApiOutput> => {
  const correction = await prisma.correction.update({
    where: { id: correctionId },
    data: {
      delete: {
        delete: {
          correctionId_targetGenreId: {
            correctionId,
            targetGenreId,
          },
        },
      },
      updatedAt: new Date(),
    },
    include: correctionInclude,
  })
  return toCorrectionApiOutput(correction)
}

const editCorrectionDraftStatus = async (
  correctionId: number,
  draft: boolean
): Promise<CorrectionApiOutput> => {
  const correction = await prisma.correction.update({
    where: { id: correctionId },
    data: { draft, updatedAt: new Date() },
    include: correctionInclude,
  })
  return toCorrectionApiOutput(correction)
}

const getCorrection = async (id: number): Promise<CorrectionApiOutput> => {
  const correction = await prisma.correction.findUnique({
    where: { id },
    include: correctionInclude,
  })
  if (!correction) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No correction with id '${id}'`,
    })
  }
  return toCorrectionApiOutput(correction)
}

const getSubmittedCorrections = async (): Promise<CorrectionApiOutput[]> => {
  const corrections = await prisma.correction.findMany({
    where: { draft: false },
    include: correctionInclude,
  })
  return corrections.map(toCorrectionApiOutput)
}

const getAccountDraftCorrections = async (
  accountId: number
): Promise<CorrectionApiOutput[]> => {
  const corrections = await prisma.correction.findMany({
    where: { draft: true, creatorId: accountId },
    include: correctionInclude,
  })
  return corrections.map(toCorrectionApiOutput)
}

const deleteCorrection = async (id: number): Promise<number> => {
  const correction = await getCorrection(id)

  const deleteCreated = prisma.genre.deleteMany({
    where: { id: { in: correction.create.map((c) => c.id) } },
  })
  const deleteEdited = prisma.genre.deleteMany({
    where: { id: { in: correction.edit.map((e) => e.updatedGenre.id) } },
  })
  const deleteCorrection = prisma.correction.delete({ where: { id } })

  await prisma.$transaction([deleteCreated, deleteEdited, deleteCorrection])

  return id
}

const mergeCorrection = async (id: number) => {
  const correction = await getCorrection(id)

  const applyEditsData = await Promise.all(
    correction.edit.map(async (e) => ({
      ...e,
      data: await dbGenreUpdateInput(e.targetGenre.id, e.updatedGenre),
    }))
  )
  const applyEdits = applyEditsData.map((e) =>
    prisma.genre.update({
      where: { id: e.targetGenre.id },
      data: e.data,
    })
  )
  const deleteEdited = prisma.genre.deleteMany({
    where: { id: { in: correction.edit.map((e) => e.updatedGenre.id) } },
  })

  const realIds: Record<number, number | undefined> = Object.fromEntries(
    correction.edit.map((e) => [e.updatedGenre.id, e.targetGenre.id])
  )
  const updateCreatedRelationIds = correction.create.map((c) =>
    prisma.genre.update({
      where: { id: c.id },
      data: {
        parents: {
          deleteMany: {},
          create: c.parents.map((parentId) => ({
            parentId: realIds[parentId] ?? parentId,
          })),
        },
        influencedBy: {
          deleteMany: {},
          create: c.influencedBy.map((inf) => ({
            influencerId: realIds[inf.id] ?? inf.id,
            influenceType: inf.influenceType,
          })),
        },
      },
    })
  )
  const updateEditedRelationIds = correction.edit.map((e) =>
    prisma.genre.update({
      where: { id: e.targetGenre.id },
      data: {
        parents: {
          deleteMany: {},
          create: e.updatedGenre.parents.map((parentId) => ({
            parentId: realIds[parentId] ?? parentId,
          })),
        },
        influencedBy: {
          deleteMany: {},
          create: e.updatedGenre.influencedBy.map((inf) => ({
            influencerId: realIds[inf.id] ?? inf.id,
            influenceType: inf.influenceType,
          })),
        },
      },
    })
  )

  const deleteGenres = prisma.genre.deleteMany({
    where: { id: { in: correction.delete.map((d) => d.id) } },
  })
  const deleteCorrection = prisma.correction.delete({ where: { id } })

  await prisma.$transaction([
    ...applyEdits,
    deleteEdited,
    ...updateCreatedRelationIds,
    ...updateEditedRelationIds,
    deleteGenres,
    deleteCorrection,
  ])

  return id
}

const correctionsRouter = createRouter()
  .mutation('add', {
    resolve: ({ ctx }) => {
      if (ctx.accountId === undefined) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return addCorrection(ctx.accountId)
    },
  })
  .query('submitted', {
    resolve: async () => getSubmittedCorrections(),
  })
  .query('drafts', {
    resolve: async ({ ctx }) => {
      if (ctx.accountId === undefined) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return getAccountDraftCorrections(ctx.accountId)
    },
  })
  .query('byId', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => getCorrection(input.id),
  })
  .mutation('edit.create.add', {
    input: z.object({ id: z.number(), data: GenreApiInput }),
    resolve: ({ input, ctx }) => {
      if (ctx.accountId === undefined) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return addCreatedGenre(input.id, input.data)
    },
  })
  .mutation('edit.edit', {
    input: z.object({
      id: z.number(),
      genreId: z.number(),
      data: GenreApiInput,
    }),
    resolve: ({ input, ctx }) => {
      if (ctx.accountId === undefined) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return updateGenre(input.id, input.genreId, input.data)
    },
  })
  .mutation('edit.create.edit', {
    input: z.object({
      id: z.number(),
      genreId: z.number(),
      data: GenreApiInput,
    }),
    resolve: ({ input, ctx }) => {
      if (ctx.accountId === undefined) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return updateCreatedGenre(input.id, input.genreId, input.data)
    },
  })
  .mutation('edit.create.remove', {
    input: z.object({ id: z.number(), genreId: z.number() }),
    resolve: ({ input, ctx }) => {
      if (ctx.accountId === undefined) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return removeCreatedGenre(input.id, input.genreId)
    },
  })
  .mutation('edit.edit.add', {
    input: z.object({
      id: z.number(),
      targetId: z.number(),
      data: GenreApiInput,
    }),
    resolve: ({ input, ctx }) => {
      if (ctx.accountId === undefined) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return addEditedGenre(input.id, input.targetId, input.data)
    },
  })
  .mutation('edit.edit.edit', {
    input: z.object({
      id: z.number(),
      targetId: z.number(),
      genreId: z.number(),
      data: GenreApiInput,
    }),
    resolve: ({ input, ctx }) => {
      if (ctx.accountId === undefined) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return updateEditedGenre(
        input.id,
        input.targetId,
        input.genreId,
        input.data
      )
    },
  })
  .mutation('edit.edit.remove', {
    input: z.object({ id: z.number(), updatedGenreId: z.number() }),
    resolve: ({ input, ctx }) => {
      if (ctx.accountId === undefined) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return removeEditedGenre(input.id, input.updatedGenreId)
    },
  })
  .mutation('edit.delete.add', {
    input: z.object({ id: z.number(), targetId: z.number() }),
    resolve: ({ input, ctx }) => {
      if (ctx.accountId === undefined) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return addDeletedGenre(input.id, input.targetId)
    },
  })
  .mutation('edit.delete.remove', {
    input: z.object({ id: z.number(), targetId: z.number() }),
    resolve: ({ input, ctx }) => {
      if (ctx.accountId === undefined) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return removeDeletedGenre(input.id, input.targetId)
    },
  })
  .mutation('edit.delete', {
    input: z.object({ id: z.number(), targetId: z.number() }),
    resolve: ({ input, ctx }) => {
      if (ctx.accountId === undefined) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return removeGenre(input.id, input.targetId)
    },
  })
  .mutation('edit.draft', {
    input: z.object({ id: z.number(), draft: z.boolean() }),
    resolve: ({ input, ctx }) => {
      if (ctx.accountId === undefined) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return editCorrectionDraftStatus(input.id, input.draft)
    },
  })
  .mutation('delete', {
    input: z.object({ id: z.number() }),
    resolve: ({ input, ctx }) => {
      if (ctx.accountId === undefined) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return deleteCorrection(input.id)
    },
  })
  .mutation('delete.timid', {
    input: z.object({ id: z.number() }),
    resolve: async ({ input, ctx }) => {
      if (ctx.accountId === undefined) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      // Only delete the correction if it's empty
      const correction = await getCorrection(input.id)
      return correction.create.length > 0 ||
        correction.edit.length > 0 ||
        correction.delete.length > 0
        ? false
        : deleteCorrection(input.id)
    },
  })
  .mutation('merge', {
    input: z.object({ id: z.number() }),
    resolve: ({ input, ctx }) => {
      if (ctx.accountId === undefined) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      return mergeCorrection(input.id)
    },
  })

export default correctionsRouter
