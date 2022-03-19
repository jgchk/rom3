import { z } from 'zod'

import { MetaApiOutput, TypedMetaApiInput } from '../../routers/metas'
import { SceneApiOutput, TypedSceneApiInput } from '../../routers/scenes'
import { StyleApiOutput, TypedStyleApiInput } from '../../routers/styles'
import { TrendApiOutput, TypedTrendApiInput } from '../../routers/trends'

export const GenreApiInput = z.discriminatedUnion('type', [
  TypedMetaApiInput,
  TypedSceneApiInput,
  TypedStyleApiInput,
  TypedTrendApiInput,
])
export type GenreApiInput = z.infer<typeof GenreApiInput>

export type GenreApiOutput =
  | MetaApiOutput
  | SceneApiOutput
  | StyleApiOutput
  | TrendApiOutput
