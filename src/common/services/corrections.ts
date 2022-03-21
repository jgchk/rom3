import trpc from '../utils/trpc'

export const useCorrectionsQuery = () =>
  trpc.useQuery(['corrections.all'], { useErrorBoundary: true })

export const useCorrectionQuery = (id: number) =>
  trpc.useQuery(['corrections.byId', { id }], { useErrorBoundary: true })

export const useAddCorrectionMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.add'], {
    onSuccess: (res) => {
      void utils.invalidateQueries('corrections.all')
      utils.setQueryData(['corrections.byId', { id: res.id }], res)
    },
  })
}
