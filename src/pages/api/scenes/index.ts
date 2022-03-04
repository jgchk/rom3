import { PrismaClient, Scene } from '@prisma/client'
import { apiHandler } from '../../../utils/api'

const prisma = new PrismaClient()

const handler = apiHandler({
  get: async (req, res) => {
    const allScenes = await prisma.scene.findMany()
    res.status(200).json(allScenes)
  },
  post: async (req, res) => {
    const scene = req.body as Scene
    const dbScene = await prisma.scene.create({ data: scene })
    res.status(201).json(dbScene)
  },
})

export default handler
