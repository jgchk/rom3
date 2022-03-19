import trpc from '../../common/utils/trpc'

export const useAddCorrectionMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation('corrections.add', {
    onSuccess: async (res) => {
      await utils.invalidateQueries('corrections.all')
      utils.setQueryData(['corrections.byId', { id: res.id }], res)
    },
  })
}
