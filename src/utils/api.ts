import { NextApiHandler, NextApiResponse } from 'next'

const isError = (t: unknown): t is Error =>
  typeof t === 'object' && t !== null && 'name' in t && 'message' in t

const errorHandler = (err: unknown, res: NextApiResponse) => {
  console.error(err)

  if (typeof err === 'string') {
    const is404 = err.toLowerCase().endsWith('not found')
    const statusCode = is404 ? 404 : 400
    return res.status(statusCode).json({ message: err })
  }

  if (isError(err)) {
    return res.status(500).json({ message: err.message })
  }

  return res.status(500).json({ message: JSON.stringify(err) })
}

export const apiHandler =
  (handlers: { [method: string]: NextApiHandler }): NextApiHandler =>
  async (req, res) => {
    const method = req.method?.toLowerCase()

    if (!method || !handlers[method]) {
      return res.status(405).send(`Method ${String(req.method)} Not Allowed`)
    }

    try {
      await handlers[method](req, res)
    } catch (error) {
      return errorHandler(error, res)
    }
  }

export const getParam = <T>(param: T | T[]): T =>
  Array.isArray(param) ? param[0] : param
