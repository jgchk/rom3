import { Correction, GenreCreate, GenreDelete, GenreEdit } from '@prisma/client'
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
const correctionInclude = {
  create: { include: { createdGenre: { include: genreInclude } } },
  edit: {
    include: {
      updatedGenre: { include: genreInclude },
      targetGenre: { include: genreInclude },
    },
  },
  delete: { include: { targetGenre: { include: genreInclude } } },
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

const addCorrection = async (): Promise<CorrectionApiOutput> => {
  const correction = await prisma.correction.create({
    data: {},
    include: correctionInclude,
  })
  return toCorrectionApiOutput(correction)
}

const addCreatedGenre = async (
  correctionId: number,
  input: GenreApiInput
): Promise<CorrectionApiOutput> => {
  const correction = await prisma.correction.update({
    where: { id: correctionId },
    data: {
      create: {
        create: {
          createdGenre: {
            create: dbGenreCreateInput(input),
          },
        },
      },
    },
    include: correctionInclude,
  })
  return toCorrectionApiOutput(correction)
}

const updateCreatedGenre = async (
  correctionId: number,
  createdGenreId: number,
  input: GenreApiInput
): Promise<CorrectionApiOutput> => {
  const correction = await prisma.correction.update({
    where: { id: correctionId },
    data: {
      create: {
        update: {
          where: { createdGenreId },
          data: {
            createdGenre: {
              update: dbGenreUpdateInput(createdGenreId, input),
            },
          },
        },
      },
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
  return getCorrection(correctionId)
}

const addEditedGenre = async (
  correctionId: number,
  targetGenreId: number,
  input: GenreApiInput
): Promise<CorrectionApiOutput> => {
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
            create: dbGenreCreateInput(input),
          },
        },
      },
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

  const editedId = correction.edit.find((e) => e.targetGenre.id === genreId)
    ?.updatedGenre.id

  return editedId !== undefined
    ? updateEditedGenre(correctionId, genreId, editedId, data)
    : addEditedGenre(correctionId, genreId, data)
}

const updateEditedGenre = async (
  correctionId: number,
  targetGenreId: number,
  updatedGenreId: number,
  input: GenreApiInput
): Promise<CorrectionApiOutput> => {
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
              update: dbGenreUpdateInput(updatedGenreId, input),
            },
          },
        },
      },
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
  return getCorrection(correctionId)
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
    },
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

const getCorrections = async (): Promise<CorrectionApiOutput[]> => {
  const corrections = await prisma.correction.findMany({
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

  const applyEdits = correction.edit.map((e) =>
    prisma.genre.update({
      where: { id: e.targetGenre.id },
      data: dbGenreUpdateInput(e.targetGenre.id, e.updatedGenre),
    })
  )
  const deleteEdited = prisma.genre.deleteMany({
    where: { id: { in: correction.edit.map((e) => e.updatedGenre.id) } },
  })

  const deleteGenres = prisma.genre.deleteMany({
    where: { id: { in: correction.delete.map((d) => d.id) } },
  })
  const deleteCorrection = prisma.correction.delete({ where: { id } })

  await prisma.$transaction([
    ...applyEdits,
    deleteEdited,
    deleteGenres,
    deleteCorrection,
  ])

  return id
}

const correctionsRouter = createRouter()
  .mutation('add', {
    resolve: () => addCorrection(),
  })
  .query('all', {
    resolve: async () => getCorrections(),
  })
  .query('byId', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => getCorrection(input.id),
  })
  .mutation('edit.create.add', {
    input: z.object({ id: z.number(), data: GenreApiInput }),
    resolve: ({ input }) => addCreatedGenre(input.id, input.data),
  })
  .mutation('edit.edit', {
    input: z.object({
      id: z.number(),
      genreId: z.number(),
      data: GenreApiInput,
    }),
    resolve: ({ input }) => updateGenre(input.id, input.genreId, input.data),
  })
  .mutation('edit.create.edit', {
    input: z.object({
      id: z.number(),
      genreId: z.number(),
      data: GenreApiInput,
    }),
    resolve: ({ input }) =>
      updateCreatedGenre(input.id, input.genreId, input.data),
  })
  .mutation('edit.create.remove', {
    input: z.object({ id: z.number(), genreId: z.number() }),
    resolve: ({ input }) => removeCreatedGenre(input.id, input.genreId),
  })
  .mutation('edit.edit.add', {
    input: z.object({
      id: z.number(),
      targetId: z.number(),
      data: GenreApiInput,
    }),
    resolve: ({ input }) =>
      addEditedGenre(input.id, input.targetId, input.data),
  })
  .mutation('edit.edit.edit', {
    input: z.object({
      id: z.number(),
      targetId: z.number(),
      genreId: z.number(),
      data: GenreApiInput,
    }),
    resolve: ({ input }) =>
      updateEditedGenre(input.id, input.targetId, input.genreId, input.data),
  })
  .mutation('edit.edit.remove', {
    input: z.object({ id: z.number(), updatedGenreId: z.number() }),
    resolve: ({ input }) => removeEditedGenre(input.id, input.updatedGenreId),
  })
  .mutation('edit.delete.add', {
    input: z.object({ id: z.number(), targetId: z.number() }),
    resolve: ({ input }) => addDeletedGenre(input.id, input.targetId),
  })
  .mutation('edit.delete.remove', {
    input: z.object({ id: z.number(), targetId: z.number() }),
    resolve: ({ input }) => removeDeletedGenre(input.id, input.targetId),
  })
  .mutation('edit.delete', {
    input: z.object({ id: z.number(), targetId: z.number() }),
    resolve: ({ input }) => removeGenre(input.id, input.targetId),
  })
  .mutation('delete', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => deleteCorrection(input.id),
  })
  .mutation('merge', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => mergeCorrection(input.id),
  })

export default correctionsRouter
