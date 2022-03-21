import trpc from '../../../common/utils/trpc'

export const useCorrectionsQuery = () =>
  trpc.useQuery(['corrections.all'], { useErrorBoundary: true })
