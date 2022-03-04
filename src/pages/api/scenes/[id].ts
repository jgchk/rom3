import { PrismaClient, Scene } from '@prisma/client'
import { apiHandler, getParam } from '../../../utils/api'

const prisma = new PrismaClient()

const handler = apiHandler({
  get: async (req, res) => {
    const id = Number.parseInt(getParam(req.query.id))
    const scene = await prisma.scene.findUnique({ where: { id } })
    res.status(200).json(scene)
  },
  put: async (req, res) => {
    const id = Number.parseInt(getParam(req.query.id))
    const update = req.body as Scene
    const updated = await prisma.scene.update({ where: { id }, data: update })
    res.status(200).json(updated)
  },
  delete: async (req, res) => {
    const id = Number.parseInt(getParam(req.query.id))
    await prisma.scene.delete({ where: { id } })
    res.status(204).send('')
  },
})

export default handler
