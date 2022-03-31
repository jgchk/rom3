import trpc, {
  InferContextType,
  InferQueryOptions,
  InferQueryOutput,
} from '../utils/trpc'

export type CorrectionApiOutput = InferQueryOutput<'corrections.byId'>

const setCorrectionGenresQueryData = (
  utils: InferContextType,
  correction: CorrectionApiOutput
) => {
  for (const createdGenre of correction.create) {
    utils.setQueryData(['genres.byId', { id: createdGenre.id }], createdGenre)
  }

  for (const editedGenre of correction.edit) {
    utils.setQueryData(
      ['genres.byId', { id: editedGenre.targetGenre.id }],
      editedGenre.targetGenre
    )
    utils.setQueryData(
      ['genres.byId', { id: editedGenre.updatedGenre.id }],
      editedGenre.updatedGenre
    )
  }

  for (const deletedGenre of correction.delete) {
    utils.setQueryData(['genres.byId', { id: deletedGenre.id }], deletedGenre)
  }
}

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

        setCorrectionGenresQueryData(utils, correction)
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

        setCorrectionGenresQueryData(utils, correction)
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
) => {
  const utils = trpc.useContext()
  return trpc.useQuery(['corrections.byId', { id }], {
    ...opts,
    useErrorBoundary: opts?.useErrorBoundary ?? true,
    onSuccess: (res) => {
      setCorrectionGenresQueryData(utils, res)

      if (opts?.onSuccess) {
        opts.onSuccess(res)
      }
    },
  })
}

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
      setCorrectionGenresQueryData(utils, res)
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

export const useAddCreatedGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.edit.create.add'], {
    onSuccess: (res) => {
      if (res.draft) {
        void utils.invalidateQueries('corrections.drafts')
      } else {
        void utils.invalidateQueries('corrections.submitted')
      }
      utils.setQueryData(['corrections.byId', { id: res.id }], res)
      setCorrectionGenresQueryData(utils, res)
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
      setCorrectionGenresQueryData(utils, res)
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
      setCorrectionGenresQueryData(utils, res)
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
      setCorrectionGenresQueryData(utils, res)
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
      setCorrectionGenresQueryData(utils, res)
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
      setCorrectionGenresQueryData(utils, res)
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

export const useUpdateCorrectionNameMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation(['corrections.edit.name'], {
    onSuccess: (res) => {
      if (res.draft) {
        void utils.invalidateQueries('corrections.drafts')
      } else {
        void utils.invalidateQueries('corrections.submitted')
      }
      utils.setQueryData(['corrections.byId', { id: res.id }], res)
      setCorrectionGenresQueryData(utils, res)
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
      setCorrectionGenresQueryData(utils, res)
    },
  })
}
