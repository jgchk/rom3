import trpc, { InferQueryOptions } from '../utils/trpc'

export const useAccountQuery = (
  id: number,
  opts?: InferQueryOptions<'accounts.byId'>
) =>
  trpc.useQuery(['accounts.byId', { id }], {
    ...opts,
    useErrorBoundary: opts?.useErrorBoundary ?? true,
  })
