import { z } from 'zod'

export const isDefined = <T>(t: T | undefined): t is T => t !== undefined
export const isNotNull = <T>(t: T | null): t is T => t !== null

export const guardWith =
  <T>(schema: z.Schema<T>) =>
  (input: unknown): input is T =>
    schema.safeParse(input).success
