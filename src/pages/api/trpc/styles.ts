import { PrismaClient } from '@prisma/client'
import * as trpc from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const Style = z.object({
  name: z.string().min(1),
  shortDesc: z.string().min(1),
  longDesc: z.string().min(1),
  alternateNames: z.array(z.string()),
  influencedBy: z.array(z.number()),
})

const prisma = new PrismaClient()

const stylesRouter = trpc
  .router()
  .mutation('add', {
    input: Style,
    resolve: async ({ input }) => {
      const style = await prisma.style.create({
        data: {
          ...input,
          alternateNames: {
            create: input.alternateNames.map((name) => ({ name })),
          },
          influencedBy: { connect: input.influencedBy.map((id) => ({ id })) },
        },
      })
      return style
    },
  })
  .query('all', {
    resolve: async () => {
      const styles = await prisma.style.findMany()
      return styles
    },
  })
  .query('byId', {
    input: z.object({ id: z.number() }),
    resolve: async ({ input }) => {
      const style = await prisma.style.findUnique({ where: { id: input.id } })
      if (!style) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No style with id '${input.id}'`,
        })
      }
      return style
    },
  })
  .mutation('edit', {
    input: Style.extend({
      id: z.number(),
    }),
    resolve: async ({ input }) => {
      const style = await prisma.style.update({
        where: { id: input.id },
        data: {
          ...input,
          alternateNames: {
            create: input.alternateNames.map((name) => ({ name })),
          },
          influencedBy: { connect: input.influencedBy.map((id) => ({ id })) },
        },
      })
      return style
    },
  })
  .mutation('delete', {
    input: z.object({ id: z.number() }),
    resolve: async ({ input }) => {
      await prisma.style.delete({ where: { id: input.id } })
      return input.id
    },
  })

export default stylesRouter
