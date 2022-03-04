import { PrismaClient, Trend } from '@prisma/client'
import { apiHandler, getParam } from '../../../utils/api'

const prisma = new PrismaClient()

const handler = apiHandler({
  get: async (req, res) => {
    const id = Number.parseInt(getParam(req.query.id))
    const trend = await prisma.trend.findUnique({ where: { id } })
    res.status(200).json(trend)
  },
  put: async (req, res) => {
    const id = Number.parseInt(getParam(req.query.id))
    const update = req.body as Trend
    const updated = await prisma.trend.update({ where: { id }, data: update })
    res.status(200).json(updated)
  },
  delete: async (req, res) => {
    const id = Number.parseInt(getParam(req.query.id))
    await prisma.trend.delete({ where: { id } })
    res.status(204).send('')
  },
})

export default handler
