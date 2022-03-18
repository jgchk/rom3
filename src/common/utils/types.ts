import { z } from 'zod'

export const isDefined = <T>(t: T | undefined): t is T => t !== undefined

export const guardWith =
  <T>(schema: z.Schema<T>) =>
  (input: unknown): input is T =>
    schema.safeParse(input).success
