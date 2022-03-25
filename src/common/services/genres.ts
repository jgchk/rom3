import trpc, { InferQueryOptions } from '../utils/trpc'

export type { GenreApiInput } from '../../modules/server/routers/genres'

export const useGenresQuery = (opts?: InferQueryOptions<'genres.all'>) =>
  trpc.useQuery(['genres.all'], {
    ...opts,
    useErrorBoundary: opts?.useErrorBoundary ?? true,
  })

export const useGenreQuery = (
  id: number,
  opts?: InferQueryOptions<'genres.byId'>
) =>
  trpc.useQuery(['genres.byId', { id }], {
    ...opts,
    useErrorBoundary: opts?.useErrorBoundary ?? true,
  })
