import trpc, { InferQueryInput, InferQueryOptions } from '../utils/trpc'

export type {
  ApiGenreInfluence,
  GenreApiInput,
} from '../../modules/server/routers/genres'

export const useGenresQuery = ({
  filters,
  opts,
}: {
  filters?: InferQueryInput<'genres.list'>
  opts?: InferQueryOptions<'genres.list'>
} = {}) => {
  const utils = trpc.useContext()
  return trpc.useQuery(['genres.list', filters ?? undefined], {
    ...opts,
    useErrorBoundary: opts?.useErrorBoundary ?? true,
    onSuccess: (res) => {
      for (const genre of res) {
        utils.setQueryData(['genres.byId', { id: genre.id }], genre)
      }

      if (opts?.onSuccess) {
        opts.onSuccess(res)
      }
    },
  })
}

export const useGenreQuery = (
  id: number,
  opts?: InferQueryOptions<'genres.byId'>
) =>
  trpc.useQuery(['genres.byId', { id }], {
    ...opts,
    useErrorBoundary: opts?.useErrorBoundary ?? true,
  })
