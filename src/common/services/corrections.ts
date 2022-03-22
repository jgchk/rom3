import trpc from '../utils/trpc'

export const useCorrectionsQuery = () =>
  trpc.useQuery(['corrections.all'], { useErrorBoundary: true })

export const useCorrectionQuery = (id: number) =>
  trpc.useQuery(['corrections.byId', { id }], { useErrorBoundary: true })

export const useCreateCorrectionMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.add'], {
    onSuccess: (res) => {
      void utils.invalidateQueries('corrections.all')
      utils.setQueryData(['corrections.byId', { id: res.id }], res)
    },
  })
}

export const useAddCreatedGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.edit.create.add'], {
    onSuccess: (res) => {
      void utils.invalidateQueries('corrections.all')
      utils.setQueryData(['corrections.byId', { id: res.id }], res)
    },
  })
}

export const useCorrectGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.edit.edit'], {
    onSuccess: (res) => {
      void utils.invalidateQueries('corrections.all')
      utils.setQueryData(['corrections.byId', { id: res.id }], res)
    },
  })
}

export const useDeleteCorrectionGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.edit.delete'], {
    onSuccess: (res) => {
      void utils.invalidateQueries('corrections.all')
      utils.setQueryData(['corrections.byId', { id: res.id }], res)
    },
  })
}
