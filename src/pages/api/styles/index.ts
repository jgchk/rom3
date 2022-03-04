import { PrismaClient, Style } from '@prisma/client'
import { apiHandler } from '../../../utils/api'

const prisma = new PrismaClient()

const handler = apiHandler({
  get: async (req, res) => {
    const allStyles = await prisma.style.findMany()
    res.status(200).json(allStyles)
  },
  post: async (req, res) => {
    const style = req.body as Style
    const dbStyle = await prisma.style.create({ data: style })
    res.status(201).json(dbStyle)
  },
})

export default handler
