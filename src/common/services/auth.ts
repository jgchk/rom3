import trpc from '../utils/trpc'

export type { GenreApiInput } from '../../modules/server/routers/genres'

export const useRegisterMutation = () =>
  trpc.useMutation('auth.register', {
    onSuccess: (res) => {
      localStorage.setItem('token', res.token)
    },
  })

export const useLoginMutation = () =>
  trpc.useMutation('auth.login', {
    onSuccess: (res) => {
      localStorage.setItem('token', res.token)
    },
  })
