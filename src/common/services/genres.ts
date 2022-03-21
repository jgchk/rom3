import trpc, { InferQueryOptions } from '../utils/trpc'

export const useGenresQuery = () =>
  trpc.useQuery(['genres.all'], { useErrorBoundary: true })

export const useGenreQuery = (
  id: number,
  opts?: InferQueryOptions<'genres.byId'>
) =>
  trpc.useQuery(['genres.byId', { id }], {
    ...opts,
    useErrorBoundary: opts?.useErrorBoundary ?? true,
  })
