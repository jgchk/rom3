import jwt from 'jsonwebtoken'

const tokenSecret = process.env.TOKEN_SECRET

if (tokenSecret === undefined) {
  throw new Error(
    'Token secret not found. Please set the TOKEN_SECRET env var.'
  )
}

export const signToken = (payload: string | object | Buffer) =>
  jwt.sign(payload, tokenSecret)

export const verifyToken = (token: string) => jwt.verify(token, tokenSecret)
