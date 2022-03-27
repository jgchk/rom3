import { NextApiRequest, NextApiResponse } from 'next'

import { login, LoginApiInput } from '../../modules/server/routers/auth'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const input = LoginApiInput.parse(req.body)
  const value = await login(input)
  res.setHeader('Set-Cookie', `token=${value.token}; HttpOnly`)
  res.json(value)
}

export default handler
