import trpc, { InferQueryInput } from '../../common/utils/trpc'

export const useGenreQuery = (input: InferQueryInput<'get'>) =>
  trpc.useQuery(['get', input])

export const useGenresQuery = (input: InferQueryInput<'genres'>) =>
  trpc.useQuery(['genres', input])

export const useAddGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation('add', {
    onSuccess: async (res) => {
      await utils.invalidateQueries('genres')
      utils.setQueryData(['get', { type: res.type, id: res.id }], res)

      switch (res.type) {
        case 'meta': {
          await utils.invalidateQueries('metas.all')
          utils.setQueryData(['metas.byId', { id: res.id }], res)
          break
        }
        case 'scene': {
          await utils.invalidateQueries('scenes.all')
          utils.setQueryData(['scenes.byId', { id: res.id }], res)
          break
        }
        case 'style': {
          await utils.invalidateQueries('styles.all')
          utils.setQueryData(['styles.byId', { id: res.id }], res)
          break
        }
        case 'trend': {
          await utils.invalidateQueries('trends.all')
          utils.setQueryData(['trends.byId', { id: res.id }], res)
          break
        }
      }
    },
  })
}

export const useEditGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation('edit', {
    onSuccess: async (res) => {
      await utils.invalidateQueries('genres')
      utils.setQueryData(['get', { type: res.type, id: res.id }], res)

      switch (res.type) {
        case 'meta': {
          await utils.invalidateQueries('metas.all')
          utils.setQueryData(['metas.byId', { id: res.id }], res)
          break
        }
        case 'scene': {
          await utils.invalidateQueries('scenes.all')
          utils.setQueryData(['scenes.byId', { id: res.id }], res)
          break
        }
        case 'style': {
          await utils.invalidateQueries('styles.all')
          utils.setQueryData(['styles.byId', { id: res.id }], res)
          break
        }
        case 'trend': {
          await utils.invalidateQueries('trends.all')
          utils.setQueryData(['trends.byId', { id: res.id }], res)
          break
        }
      }
    },
  })
}

export const useDeleteGenreMutation = () => {
  const utils = trpc.useContext()
  return trpc.useMutation('delete', {
    onSuccess: async () => {
      await utils.invalidateQueries('genres')
      await utils.invalidateQueries('get')

      // we have to invalidate queries for all genre types since
      // we may have deleted relationships with them (parent, influence, etc.)
      await utils.invalidateQueries('metas.all')
      await utils.invalidateQueries('metas.byId')
      await utils.invalidateQueries('scenes.all')
      await utils.invalidateQueries('scenes.byId')
      await utils.invalidateQueries('styles.all')
      await utils.invalidateQueries('styles.byId')
      await utils.invalidateQueries('trends.all')
      await utils.invalidateQueries('trends.byId')
    },
  })
}
