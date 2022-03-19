import { Correction } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import createRouter from '../createRouter'
import prisma from '../prisma'
import { GenreInput } from '../utils/validators'
import { GenreTypeInput } from '../utils/validators/misc'
import { createMetaDbInput, MetaApiInput } from './metas'
import { createSceneDbInput, SceneApiInput } from './scenes'
import { createStyleDbInput, StyleApiInput } from './styles'
import { createTrendDbInput, TrendApiInput } from './trends'

const CreateCorrectionApiInput = z.object({
  action: z.literal('create'),
  data: GenreInput,
})
type CreateCorrectionApiInput = z.infer<typeof CreateCorrectionApiInput>

const EditCorrectionApiInput = z.object({
  action: z.literal('edit'),
  targetId: z.number(),
  data: GenreInput,
})
type EditCorrectionApiInput = z.infer<typeof EditCorrectionApiInput>

const DeleteCorrectionApiInput = z.object({
  action: z.literal('delete'),
  type: GenreTypeInput,
  id: z.number(),
})
type DeleteCorrectionApiInput = z.infer<typeof DeleteCorrectionApiInput>

const CorrectionApiInput = z.array(
  z.discriminatedUnion('action', [
    CreateCorrectionApiInput,
    EditCorrectionApiInput,
    DeleteCorrectionApiInput,
  ])
)
export type CorrectionApiInput = z.infer<typeof CorrectionApiInput>

const isCreateOrEditCorrectionApiInput = (
  o: CorrectionApiInput[number]
): o is CreateCorrectionApiInput | EditCorrectionApiInput =>
  o.action === 'create' || o.action === 'edit'
const isDeleteCorrectionApiInput = (
  o: CorrectionApiInput[number]
): o is DeleteCorrectionApiInput => o.action === 'delete'

const isMetaCorrectionApiInput = <T extends { data: GenreInput }>(
  o: T
): o is T & { data: MetaApiInput } => o.data.type === 'meta'
const isSceneCorrectionApiInput = <T extends { data: GenreInput }>(
  o: T
): o is T & { data: SceneApiInput } => o.data.type === 'scene'
const isStyleCorrectionApiInput = <T extends { data: GenreInput }>(
  o: T
): o is T & { data: StyleApiInput } => o.data.type === 'style'
const isTrendCorrectionApiInput = <T extends { data: GenreInput }>(
  o: T
): o is T & { data: TrendApiInput } => o.data.type === 'trend'

export type CorrectionApiOutput = Correction & {
  type: 'correction'
}

const toApiOutput = (correction: Correction): CorrectionApiOutput => ({
  ...correction,
  type: 'correction',
})

export const addCorrection = async (
  input: CorrectionApiInput
): Promise<CorrectionApiOutput> => {
  const correction = await prisma.correction.create({
    data: {
      metas: {
        create: input
          .filter(isCreateOrEditCorrectionApiInput)
          .filter(isMetaCorrectionApiInput)
          .map((i) => ({
            ...(i.action === 'edit' ? { targetMetaId: i.targetId } : {}),
            meta: createMetaDbInput(i.data),
          })),
      },
      scenes: {
        create: input
          .filter(isCreateOrEditCorrectionApiInput)
          .filter(isSceneCorrectionApiInput)
          .map((i) => ({
            ...(i.action === 'edit' ? { targetSceneId: i.targetId } : {}),
            scene: createSceneDbInput(i.data),
          })),
      },
      styles: {
        create: input
          .filter(isCreateOrEditCorrectionApiInput)
          .filter(isStyleCorrectionApiInput)
          .map((i) => ({
            ...(i.action === 'edit' ? { targetStyleId: i.targetId } : {}),
            style: createStyleDbInput(i.data),
          })),
      },
      trends: {
        create: input
          .filter(isCreateOrEditCorrectionApiInput)
          .filter(isTrendCorrectionApiInput)
          .map((i) => ({
            ...(i.action === 'edit' ? { targetTrendId: i.targetId } : {}),
            trend: createTrendDbInput(i.data),
          })),
      },
      deleteMetas: {
        create: input
          .filter(isDeleteCorrectionApiInput)
          .filter((i) => i.type === 'meta')
          .map((i) => ({ targetMetaId: i.id })),
      },
      deleteScenes: {
        create: input
          .filter(isDeleteCorrectionApiInput)
          .filter((i) => i.type === 'scene')
          .map((i) => ({ targetSceneId: i.id })),
      },
      deleteStyles: {
        create: input
          .filter(isDeleteCorrectionApiInput)
          .filter((i) => i.type === 'style')
          .map((i) => ({ targetStyleId: i.id })),
      },
      deleteTrends: {
        create: input
          .filter(isDeleteCorrectionApiInput)
          .filter((i) => i.type === 'trend')
          .map((i) => ({ targetTrendId: i.id })),
      },
    },
  })
  return toApiOutput(correction)
}

export const getCorrection = async (
  id: number
): Promise<CorrectionApiOutput> => {
  const correction = await prisma.correction.findUnique({
    where: { id },
  })
  if (!correction) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No correction with id '${id}'`,
    })
  }
  return toApiOutput(correction)
}

export const getCorrections = async (): Promise<CorrectionApiOutput[]> => {
  const corrections = await prisma.correction.findMany()
  return corrections.map(toApiOutput)
}

export const editCorrection = async (
  id: number,
  input: CorrectionApiInput
): Promise<CorrectionApiOutput> => {
  const correction = await prisma.correction.update({
    where: { id: id },
    data: {
      metas: {
        deleteMany: { correctionId: id },
        create: input
          .filter(isCreateOrEditCorrectionApiInput)
          .filter(isMetaCorrectionApiInput)
          .map((i) => ({
            ...(i.action === 'edit' ? { targetMetaId: i.targetId } : {}),
            meta: createMetaDbInput(i.data),
          })),
      },
      scenes: {
        deleteMany: { correctionId: id },
        create: input
          .filter(isCreateOrEditCorrectionApiInput)
          .filter(isSceneCorrectionApiInput)
          .map((i) => ({
            ...(i.action === 'edit' ? { targetSceneId: i.targetId } : {}),
            scene: createSceneDbInput(i.data),
          })),
      },
      styles: {
        deleteMany: { correctionId: id },
        create: input
          .filter(isCreateOrEditCorrectionApiInput)
          .filter(isStyleCorrectionApiInput)
          .map((i) => ({
            ...(i.action === 'edit' ? { targetStyleId: i.targetId } : {}),
            style: createStyleDbInput(i.data),
          })),
      },
      trends: {
        deleteMany: { correctionId: id },
        create: input
          .filter(isCreateOrEditCorrectionApiInput)
          .filter(isTrendCorrectionApiInput)
          .map((i) => ({
            ...(i.action === 'edit' ? { targetTrendId: i.targetId } : {}),
            trend: createTrendDbInput(i.data),
          })),
      },
      deleteMetas: {
        deleteMany: { correctionId: id },
        create: input
          .filter(isDeleteCorrectionApiInput)
          .filter((i) => i.type === 'meta')
          .map((i) => ({ targetMetaId: i.id })),
      },
      deleteScenes: {
        deleteMany: { correctionId: id },
        create: input
          .filter(isDeleteCorrectionApiInput)
          .filter((i) => i.type === 'scene')
          .map((i) => ({ targetSceneId: i.id })),
      },
      deleteStyles: {
        deleteMany: { correctionId: id },
        create: input
          .filter(isDeleteCorrectionApiInput)
          .filter((i) => i.type === 'style')
          .map((i) => ({ targetStyleId: i.id })),
      },
      deleteTrends: {
        deleteMany: { correctionId: id },
        create: input
          .filter(isDeleteCorrectionApiInput)
          .filter((i) => i.type === 'trend')
          .map((i) => ({ targetTrendId: i.id })),
      },
    },
  })
  return toApiOutput(correction)
}

export const deleteCorrection = async (id: number): Promise<number> => {
  await prisma.correction.delete({ where: { id } })
  return id
}

const correctionsRouter = createRouter()
  .mutation('add', {
    input: CorrectionApiInput,
    resolve: ({ input }) => addCorrection(input),
  })
  .query('all', {
    resolve: async () => {
      const styles = await prisma.meta.findMany()
      return styles
    },
  })
  .query('byId', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => getCorrection(input.id),
  })
  .mutation('edit', {
    input: z.object({
      id: z.number(),
      data: CorrectionApiInput,
    }),
    resolve: ({ input }) => editCorrection(input.id, input.data),
  })
  .mutation('delete', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => deleteCorrection(input.id),
  })

export default correctionsRouter
