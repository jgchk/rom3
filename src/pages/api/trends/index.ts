import { PrismaClient, Trend } from '@prisma/client'
import { apiHandler } from '../../../utils/api'

const prisma = new PrismaClient()

const handler = apiHandler({
  get: async (req, res) => {
    const allTrends = await prisma.trend.findMany()
    res.status(200).json(allTrends)
  },
  post: async (req, res) => {
    const trend = req.body as Trend
    const dbTrend = await prisma.trend.create({ data: trend })
    res.status(201).json(dbTrend)
  },
})

export default handler
