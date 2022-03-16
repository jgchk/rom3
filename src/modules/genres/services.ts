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

// TODO: invalidate or update related queries (parents, influences)
export const useDeleteGenreMutation = () => {
  const util = trpc.useContext()
  return trpc.useMutation('delete', {
    onSuccess: async (_, { type, id }) => {
      await util.invalidateQueries('genres')
      await util.invalidateQueries(['get', { type, id }])
      switch (type) {
        case 'scene': {
          await util.invalidateQueries('scenes.all')
          await util.invalidateQueries(['scenes.byId', { id }])
          break
        }
        case 'style': {
          await util.invalidateQueries('styles.all')
          await util.invalidateQueries(['styles.byId', { id }])
          break
        }
        case 'trend': {
          await util.invalidateQueries('trends.all')
          await util.invalidateQueries(['trends.byId', { id }])
          break
        }
      }
    },
  })
}
