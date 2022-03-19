import { z } from 'zod'

import { TypedMetaApiInput } from '../../routers/metas'
import { TypedSceneApiInput } from '../../routers/scenes'
import { TypedStyleApiInput } from '../../routers/styles'
import { TypedTrendApiInput } from '../../routers/trends'

// TODO: flatten structure
export const GenreInput = z.discriminatedUnion('type', [
  TypedMetaApiInput,
  TypedSceneApiInput,
  TypedStyleApiInput,
  TypedTrendApiInput,
])
export type GenreInput = z.infer<typeof GenreInput>
