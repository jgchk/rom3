import trpc, { InferQueryOptions } from '../utils/trpc'

export const useCorrectionsQuery = (
  opts?: InferQueryOptions<'corrections.all'>
) =>
  trpc.useQuery(['corrections.all'], {
    ...opts,
    useErrorBoundary: opts?.useErrorBoundary ?? true,
  })

export const useCorrectionQuery = (
  id: number,
  opts?: InferQueryOptions<'corrections.byId'>
) =>
  trpc.useQuery(['corrections.byId', { id }], {
    ...opts,
    useErrorBoundary: opts?.useErrorBoundary ?? true,
  })

export const useCreateCorrectionMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.add'], {
    onSuccess: (res) => {
      void utils.invalidateQueries('corrections.all')
      utils.setQueryData(['corrections.byId', { id: res.id }], res)
    },
  })
}

export const useDeleteCorrectionMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.delete'], {
    onSuccess: (_, input) => {
      void utils.invalidateQueries('corrections.all')
      void utils.invalidateQueries(['corrections.byId', { id: input.id }])
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

export const useRemoveCreateGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.edit.create.remove'], {
    onSuccess: (res) => {
      void utils.invalidateQueries('corrections.all')
      utils.setQueryData(['corrections.byId', { id: res.id }], res)
    },
  })
}

export const useRemoveEditGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.edit.edit.remove'], {
    onSuccess: (res) => {
      void utils.invalidateQueries('corrections.all')
      utils.setQueryData(['corrections.byId', { id: res.id }], res)
    },
  })
}

export const useRemoveDeleteGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.edit.delete.remove'], {
    onSuccess: (res) => {
      void utils.invalidateQueries('corrections.all')
      utils.setQueryData(['corrections.byId', { id: res.id }], res)
    },
  })
}

export const useMergeCorrectionMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.merge'], {
    onSuccess: (_, input) => {
      void utils.invalidateQueries('corrections.all')
      void utils.invalidateQueries(['corrections.byId', { id: input.id }])
      void utils.invalidateQueries('genres.all')
      void utils.invalidateQueries('genres.byId')
    },
  })
}
