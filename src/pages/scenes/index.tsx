import { NextPage } from 'next'
import trpc from '../../services'

const Scenes: NextPage = () => {
  const { data, error } = trpc.useQuery(['scenes.all'])

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
          {data.map((scene) => (
            <tr key={scene.id}>
              <td>{scene.name}</td>
              <td>{scene.shortDesc}</td>
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

export default Scenes