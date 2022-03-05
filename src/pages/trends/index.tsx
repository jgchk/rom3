import { NextPage } from 'next'
import trpc from '../../services'

const Trends: NextPage = () => {
  const { data, error } = trpc.useQuery(['trends.all'])

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
          {data.map((trend) => (
            <tr key={trend.id}>
              <td>{trend.name}</td>
              <td>{trend.shortDesc}</td>
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

export default Trends
