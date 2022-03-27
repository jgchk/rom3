import trpc from '../utils/trpc'

export type { GenreApiInput } from '../../modules/server/routers/genres'

export const useWhoamiQuery = () =>
  trpc.useQuery(['auth.whoami'], { useErrorBoundary: true })

export const useRegisterMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation('auth.register', {
    onSuccess: (res) => {
      localStorage.setItem('token', res.token)
      utils.setQueryData(['auth.whoami'], res.account)
    },
  })
}

export const useLoginMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation('auth.login', {
    onSuccess: (res) => {
      localStorage.setItem('token', res.token)
      utils.setQueryData(['auth.whoami'], res.account)
    },
  })
}
