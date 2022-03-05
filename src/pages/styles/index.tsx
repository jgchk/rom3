import { NextPage } from 'next'
import trpc from '../../services'

const Styles: NextPage = () => {
  const { data, error } = trpc.useQuery(['styles.all'])

  if (data) {
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map((style) => (
            <tr key={style.id}>
              <td>{style.name}</td>
              <td>{style.shortDesc}</td>
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

export default Styles
