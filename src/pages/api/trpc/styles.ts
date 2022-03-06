import {
  PrismaClient,
  Style,
  StyleInfluence,
  StyleName,
  StyleParent,
} from '@prisma/client'
import * as trpc from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const prisma = new PrismaClient()

export const StyleInput = z.object({
  name: z.string().min(1),
  shortDesc: z.string().min(1),
  longDesc: z.string().min(1),
  alternateNames: z.array(z.string()),
  parentStyles: z.array(z.number()),
  influencedByStyles: z.array(z.number()),
})
export type StyleInput = z.infer<typeof StyleInput>

export type StyleOutput = Style & {
  type: 'style'
  alternateNames: string[]
  parentStyles: Style[]
  influencedByStyles: Style[]
}

const toOutput = (
  style: Style & {
    alternateNames: StyleName[]
    parentStyles: (StyleParent & { parent: Style })[]
    influencedByStyles: (StyleInfluence & { influencer: Style })[]
  }
): StyleOutput => ({
  ...style,
  type: 'style',
  alternateNames: style.alternateNames.map((an) => an.name),
  parentStyles: style.parentStyles.map((p) => p.parent),
  influencedByStyles: style.influencedByStyles.map((inf) => inf.influencer),
})

export const addStyle = async (input: StyleInput): Promise<StyleOutput> => {
  const style = await prisma.style.create({
    data: {
      ...input,
      alternateNames: {
        create: input.alternateNames.map((name) => ({ name })),
      },
      parentStyles: {
        create: input.parentStyles.map((id) => ({ parentId: id })),
      },
      influencedByStyles: {
        create: input.influencedByStyles.map((id) => ({ influencerId: id })),
      },
    },
    include: {
      alternateNames: true,
      parentStyles: { include: { parent: true } },
      influencedByStyles: { include: { influencer: true } },
    },
  })
  return toOutput(style)
}

export const getStyle = async (id: number): Promise<StyleOutput> => {
  const style = await prisma.style.findUnique({
    where: { id },
    include: {
      alternateNames: true,
      parentStyles: { include: { parent: true } },
      influencedByStyles: { include: { influencer: true } },
    },
  })
  if (!style) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `No style with id '${id}'`,
    })
  }
  return toOutput(style)
}

export const editStyle = async (
  id: number,
  data: StyleInput
): Promise<StyleOutput> => {
  await prisma.styleName.deleteMany({ where: { styleId: id } })
  await prisma.styleParent.deleteMany({ where: { childId: id } })
  await prisma.styleInfluence.deleteMany({ where: { influencedId: id } })
  const style = await prisma.style.update({
    where: { id: id },
    data: {
      ...data,
      alternateNames: {
        create: data.alternateNames.map((name) => ({ name })),
      },
      parentStyles: {
        create: data.parentStyles.map((id) => ({ parentId: id })),
      },
      influencedByStyles: {
        create: data.influencedByStyles.map((id) => ({ influencerId: id })),
      },
    },
    include: {
      alternateNames: true,
      parentStyles: { include: { parent: true } },
      influencedByStyles: { include: { influencer: true } },
    },
  })
  return toOutput(style)
}

export const deleteStyle = async (id: number): Promise<number> => {
  const deleteNames = prisma.styleName.deleteMany({ where: { styleId: id } })
  const deleteStyleParents = prisma.styleParent.deleteMany({
    where: { childId: id },
  })
  const deleteStyleChildren = prisma.styleParent.deleteMany({
    where: { parentId: id },
  })
  const deleteTrendChildren = prisma.trendStyleParent.deleteMany({
    where: { parentId: id },
  })
  const deleteInfluencesStyles = prisma.styleInfluence.deleteMany({
    where: { influencerId: id },
  })
  const deleteInfluencesTrends = prisma.trendStyleInfluence.deleteMany({
    where: { influencerId: id },
  })
  const deleteInfluencedByStyles = prisma.styleInfluence.deleteMany({
    where: { influencedId: id },
  })
  const deleteStyle = prisma.style.delete({ where: { id } })
  await prisma.$transaction([
    deleteNames,
    deleteStyleParents,
    deleteStyleChildren,
    deleteTrendChildren,
    deleteInfluencesStyles,
    deleteInfluencedByStyles,
    deleteInfluencesTrends,
    deleteStyle,
  ])
  return id
}

const stylesRouter = trpc
  .router()
  .mutation('add', {
    input: StyleInput,
    resolve: ({ input }) => addStyle(input),
  })
  .query('all', {
    resolve: async () => {
      const styles = await prisma.style.findMany()
      return styles
    },
  })
  .query('byId', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => getStyle(input.id),
  })
  .mutation('edit', {
    input: z.object({
      id: z.number(),
      data: StyleInput,
    }),
    resolve: ({ input }) => editStyle(input.id, input.data),
  })
  .mutation('delete', {
    input: z.object({ id: z.number() }),
    resolve: ({ input }) => deleteStyle(input.id),
  })

export default stylesRouter
