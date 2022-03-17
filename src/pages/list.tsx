import { NextPage } from 'next'
import Link from 'next/link'
import { useCallback } from 'react'
import toast from 'react-hot-toast'

import {
  useDeleteGenreMutation,
  useGenresQuery,
} from '../modules/genres/services'
import { GenreName, getGenreKey } from '../modules/genres/utils/types'

const List: NextPage = () => {
  const { data, error } = useGenresQuery({
    type: ['meta', 'scene', 'style', 'trend'],
  })

  const { mutate: deleteItem } = useDeleteGenreMutation()
  const handleDelete = useCallback(
    (type: GenreName, id: number, name: string) =>
      deleteItem(
        { type, id },
        {
          onError: (error) => {
            toast.error(error.message)
          },
          onSuccess: () => {
            toast.success(`Deleted ${name}!`)
          },
        }
      ),
    [deleteItem]
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
            <tr key={getGenreKey(genre)}>
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
