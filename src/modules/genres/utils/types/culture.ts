import { InferQueryOutput } from '../../../../common/utils/trpc'

export type CultureOutput = InferQueryOutput<'scenes.byId'>['cultures'][number]
