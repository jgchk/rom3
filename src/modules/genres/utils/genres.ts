import {
  InferMutationInput,
  InferQueryOutput,
} from '../../../common/utils/trpc'

export type GenreOutputsMap = {
  [K in InferQueryOutput<'genres'>[number]['type']]: InferQueryOutput<`${K}s.byId`>
}

export type GenreInputsMap = {
  [K in InferMutationInput<'add'>['type']]: InferMutationInput<`${K}s.add`>
}
