import trpc, { InferQueryOptions, InferQueryOutput } from '../utils/trpc'

export type CorrectionApiOutput = InferQueryOutput<'corrections.byId'>

export const useSubmittedCorrectionsQuery = (
  opts?: InferQueryOptions<'corrections.submitted'>
) => {
  const utils = trpc.useContext()
  return trpc.useQuery(['corrections.submitted'], {
    ...opts,
    useErrorBoundary: opts?.useErrorBoundary ?? true,
    onSuccess: (res) => {
      for (const correction of res) {
        utils.setQueryData(
          ['corrections.byId', { id: correction.id }],
          correction
        )
      }

      if (opts?.onSuccess) {
        opts.onSuccess(res)
      }
    },
  })
}

export const useDraftCorrectionsQuery = (
  opts?: InferQueryOptions<'corrections.drafts'>
) => {
  const utils = trpc.useContext()
  return trpc.useQuery(['corrections.drafts'], {
    ...opts,
    useErrorBoundary: opts?.useErrorBoundary ?? true,
    onSuccess: (res) => {
      for (const correction of res) {
        utils.setQueryData(
          ['corrections.byId', { id: correction.id }],
          correction
        )
      }

      if (opts?.onSuccess) {
        opts.onSuccess(res)
      }
    },
  })
}

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
      if (res.draft) {
        void utils.invalidateQueries('corrections.drafts')
      } else {
        void utils.invalidateQueries('corrections.submitted')
      }
      utils.setQueryData(['corrections.byId', { id: res.id }], res)
    },
  })
}

export const useDeleteCorrectionMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.delete'], {
    onSuccess: (_, input) => {
      void utils.invalidateQueries('corrections.drafts')
      void utils.invalidateQueries('corrections.submitted')
      void utils.invalidateQueries(['corrections.byId', { id: input.id }])
    },
  })
}

export const useDeleteCorrectionTimidMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.delete.timid'], {
    onSuccess: (res, input) => {
      // Correction was not deleted
      if (res === false) return

      // Correction was deleted
      void utils.invalidateQueries('corrections.drafts')
      void utils.invalidateQueries('corrections.submitted')
      void utils.invalidateQueries(['corrections.byId', { id: input.id }])
    },
  })
}

export const useAddCreatedGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.edit.create.add'], {
    onSuccess: (res) => {
      if (res.correction.draft) {
        void utils.invalidateQueries('corrections.drafts')
      } else {
        void utils.invalidateQueries('corrections.submitted')
      }
      utils.setQueryData(
        ['corrections.byId', { id: res.correction.id }],
        res.correction
      )
    },
  })
}

export const useCorrectGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.edit.edit'], {
    onSuccess: (res) => {
      if (res.draft) {
        void utils.invalidateQueries('corrections.drafts')
      } else {
        void utils.invalidateQueries('corrections.submitted')
      }
      utils.setQueryData(['corrections.byId', { id: res.id }], res)
    },
  })
}

export const useDeleteCorrectionGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.edit.delete'], {
    onSuccess: (res) => {
      if (res.draft) {
        void utils.invalidateQueries('corrections.drafts')
      } else {
        void utils.invalidateQueries('corrections.submitted')
      }
      utils.setQueryData(['corrections.byId', { id: res.id }], res)
    },
  })
}

export const useRemoveCreateGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.edit.create.remove'], {
    onSuccess: (res) => {
      if (res.draft) {
        void utils.invalidateQueries('corrections.drafts')
      } else {
        void utils.invalidateQueries('corrections.submitted')
      }
      utils.setQueryData(['corrections.byId', { id: res.id }], res)
    },
  })
}

export const useRemoveEditGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.edit.edit.remove'], {
    onSuccess: (res) => {
      if (res.draft) {
        void utils.invalidateQueries('corrections.drafts')
      } else {
        void utils.invalidateQueries('corrections.submitted')
      }
      utils.setQueryData(['corrections.byId', { id: res.id }], res)
    },
  })
}

export const useRemoveDeleteGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.edit.delete.remove'], {
    onSuccess: (res) => {
      if (res.draft) {
        void utils.invalidateQueries('corrections.drafts')
      } else {
        void utils.invalidateQueries('corrections.submitted')
      }
      utils.setQueryData(['corrections.byId', { id: res.id }], res)
    },
  })
}

export const useMergeCorrectionMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.merge'], {
    onSuccess: (_, input) => {
      void utils.invalidateQueries('corrections.drafts')
      void utils.invalidateQueries('corrections.submitted')
      void utils.invalidateQueries(['corrections.byId', { id: input.id }])
      void utils.invalidateQueries('genres.list')
      void utils.invalidateQueries('genres.byId')
    },
  })
}

// TODO: make optimistic
// https://react-query.tanstack.com/guides/optimistic-updates
export const useUpdateCorrectionDraftStatusMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.edit.draft'], {
    onSuccess: (res) => {
      void utils.invalidateQueries('corrections.drafts')
      void utils.invalidateQueries('corrections.submitted')
      utils.setQueryData(['corrections.byId', { id: res.id }], res)
    },
  })
}
