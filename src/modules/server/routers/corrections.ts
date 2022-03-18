import { Correction } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { guardWith } from '../../../common/utils/types'
import createRouter from '../createRouter'
import prisma from '../prisma'
import {
  TypedMetaApiInput,
  TypedSceneApiInput,
  TypedStyleApiInput,
  TypedTrendApiInput,
} from '../utils/validators'
import { createMetaDbInput } from './metas'
import { createSceneDbInput } from './scenes'
import { createStyleDbInput } from './styles'
import { createTrendDbInput } from './trends'

const BaseCorrectionApiInput = z.discriminatedUnion('action', [
  z.object({ action: z.literal('create') }),
  z.object({ action: z.literal('edit'), targetId: z.number() }),
])
const MetaCorrectionApiInput = BaseCorrectionApiInput.and(TypedMetaApiInput)
const SceneCorrectionApiInput = BaseCorrectionApiInput.and(TypedSceneApiInput)
const StyleCorrectionApiInput = BaseCorrectionApiInput.and(TypedStyleApiInput)
const TrendCorrectionApiInput = BaseCorrectionApiInput.and(TypedTrendApiInput)
export const CorrectionApiInput = z.array(
  z.union([
    MetaCorrectionApiInput,
    SceneCorrectionApiInput,
    StyleCorrectionApiInput,
    TrendCorrectionApiInput,
  ])
)
export type CorrectionApiInput = z.infer<typeof CorrectionApiInput>

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
        create: input.filter(guardWith(MetaCorrectionApiInput)).map((i) => ({
          ...(i.action === 'edit' ? { targetMetaId: i.targetId } : {}),
          meta: createMetaDbInput(i.data),
        })),
      },
      scenes: {
        create: input.filter(guardWith(SceneCorrectionApiInput)).map((i) => ({
          ...(i.action === 'edit' ? { targetSceneId: i.targetId } : {}),
          scene: createSceneDbInput(i.data),
        })),
      },
      styles: {
        create: input.filter(guardWith(StyleCorrectionApiInput)).map((i) => ({
          ...(i.action === 'edit' ? { targetStyleId: i.targetId } : {}),
          style: createStyleDbInput(i.data),
        })),
      },
      trends: {
        create: input.filter(guardWith(TrendCorrectionApiInput)).map((i) => ({
          ...(i.action === 'edit' ? { targetTrendId: i.targetId } : {}),
          trend: createTrendDbInput(i.data),
        })),
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
        create: input.filter(guardWith(MetaCorrectionApiInput)).map((i) => ({
          ...(i.action === 'edit' ? { targetMetaId: i.targetId } : {}),
          meta: createMetaDbInput(i.data),
        })),
      },
      scenes: {
        create: input.filter(guardWith(SceneCorrectionApiInput)).map((i) => ({
          ...(i.action === 'edit' ? { targetSceneId: i.targetId } : {}),
          scene: createSceneDbInput(i.data),
        })),
      },
      styles: {
        create: input.filter(guardWith(StyleCorrectionApiInput)).map((i) => ({
          ...(i.action === 'edit' ? { targetStyleId: i.targetId } : {}),
          style: createStyleDbInput(i.data),
        })),
      },
      trends: {
        create: input.filter(guardWith(TrendCorrectionApiInput)).map((i) => ({
          ...(i.action === 'edit' ? { targetTrendId: i.targetId } : {}),
          trend: createTrendDbInput(i.data),
        })),
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
