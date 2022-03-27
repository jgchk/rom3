import { setToken } from '../utils/auth'
import trpc, { InferQueryOptions } from '../utils/trpc'

export type { GenreApiInput } from '../../modules/server/routers/genres'

export const useWhoamiQuery = (opts?: InferQueryOptions<'auth.whoami'>) =>
  trpc.useQuery(['auth.whoami'], {
    ...opts,
    useErrorBoundary: opts?.useErrorBoundary ?? true,
  })

export const useRegisterMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation('auth.register', {
    onSuccess: (res) => {
      setToken(res.token)
      utils.setQueryData(['auth.whoami'], res.account)
    },
  })
}

export const useLoginMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation('auth.login', {
    onSuccess: (res) => {
      setToken(res.token)
      utils.setQueryData(['auth.whoami'], res.account)
    },
  })
}
