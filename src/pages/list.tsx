import { NextPage } from 'next'
import Link from 'next/link'

import trpc from '../utils/trpc'

const List: NextPage = () => {
  const { data, error } = trpc.useQuery([
    'genres',
    { type: ['scene', 'style', 'trend'] },
  ])

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
