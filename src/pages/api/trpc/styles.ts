import { PrismaClient, Style, StyleName } from '@prisma/client'
import * as trpc from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const prisma = new PrismaClient()

export const StyleInput = z.object({
  name: z.string().min(1),
  shortDesc: z.string().min(1),
  longDesc: z.string().min(1),
  alternateNames: z.array(z.string()),
  influencedBy: z.array(z.number()),
  parents: z.array(z.number()),
})
export type StyleInput = z.infer<typeof StyleInput>

export type StyleOutput = Style & {
  type: 'style'
  alternateNames: string[]
  influencedBy: Style[]
  parents: Style[]
}

const toOutput = (
  style: Style & {
    alternateNames: StyleName[]
    parents: Style[]
    influencedBy: Style[]
  }
): StyleOutput => ({
  ...style,
  type: 'style',
  alternateNames: style.alternateNames.map((an) => an.name),
})

export const addStyle = async (input: StyleInput): Promise<StyleOutput> => {
  const style = await prisma.style.create({
    data: {
      ...input,
      alternateNames: {
        create: input.alternateNames.map((name) => ({ name })),
      },
      influencedBy: { connect: input.influencedBy.map((id) => ({ id })) },
      parents: { connect: input.parents.map((id) => ({ id })) },
    },
    include: { alternateNames: true, influencedBy: true, parents: true },
  })
  return toOutput(style)
}

export const getStyle = async (id: number): Promise<StyleOutput> => {
  const style = await prisma.style.findUnique({
    where: { id },
    include: { alternateNames: true, influencedBy: true, parents: true },
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
  const style = await prisma.style.update({
    where: { id: id },
    data: {
      ...data,
      alternateNames: {
        create: data.alternateNames.map((name) => ({ name })),
      },
      influencedBy: { connect: data.influencedBy.map((id) => ({ id })) },
      parents: { connect: data.parents.map((id) => ({ id })) },
    },
    include: { alternateNames: true, influencedBy: true, parents: true },
  })
  return toOutput(style)
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
    resolve: async ({ input }) => {
      await prisma.style.delete({ where: { id: input.id } })
      return input.id
    },
  })

export default stylesRouter
