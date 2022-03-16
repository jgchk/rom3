import { NextPage } from 'next'
import Link from 'next/link'
import { useCallback } from 'react'
import toast from 'react-hot-toast'

import trpc from '../common/utils/trpc'
import { GenreType } from '../modules/genres/utils/create'

const List: NextPage = () => {
  const { data, error } = trpc.useQuery([
    'genres',
    { type: ['meta', 'scene', 'style', 'trend'] },
  ])

  const { mutate: deleteItem } = trpc.useMutation('delete')
  const util = trpc.useContext()
  const handleDelete = useCallback(
    (type: GenreType, id: number, name: string) =>
      deleteItem(
        { type, id },
        {
          onError: (error) => {
            toast.error(error.message)
          },
          onSuccess: async (_, { type, id }) => {
            toast.success(`Deleted ${name}!`)

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
        }
      ),
    [deleteItem, util]
  )

  if (data) {
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((genre) => (
            <tr key={genre.id}>
              <td>{genre.name}</td>
              <td>{genre.type}</td>
              <td>{genre.shortDesc}</td>
              <td>
                <Link
                  href={{
                    pathname: '/edit',
                    query: { type: genre.type, id: genre.id },
                  }}
                >
                  <a>Edit</a>
                </Link>
                <button
                  onClick={() => handleDelete(genre.type, genre.id, genre.name)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  if (error) {
    return (
      <div>
        <div>Error</div>
        <div>{error.message}</div>
      </div>
    )
  }

  return <div>Loading...</div>
}

export default List
