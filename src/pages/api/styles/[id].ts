import { PrismaClient, Style } from '@prisma/client'
import { apiHandler, getParam } from '../../../utils/api'

const prisma = new PrismaClient()

const handler = apiHandler({
  get: async (req, res) => {
    const id = Number.parseInt(getParam(req.query.id))
    const style = await prisma.style.findUnique({ where: { id } })
    res.status(200).json(style)
  },
  put: async (req, res) => {
    const id = Number.parseInt(getParam(req.query.id))
    const update = req.body as Style
    const updated = await prisma.style.update({ where: { id }, data: update })
    res.status(200).json(updated)
  },
  delete: async (req, res) => {
    const id = Number.parseInt(getParam(req.query.id))
    await prisma.style.delete({ where: { id } })
    res.status(204).send('')
  },
})

export default handler
