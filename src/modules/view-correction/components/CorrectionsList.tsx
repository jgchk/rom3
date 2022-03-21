import Link from 'next/link'
import { FC } from 'react'

import { useCorrectionsQuery } from '../../../common/services/corrections'

const CorrectionsList: FC = () => {
  const { data } = useCorrectionsQuery()

  if (data) {
    return (
      <div>
        <Link href='/corrections/edit'>
          <a>Create New</a>
        </Link>
        <ul>
          {data.map((correction) => (
            <li key={correction.id}>
              <Link href={`/corrections/${correction.id}`}>
                <a>{correction.id}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return <div>Loading...</div>
}

export default CorrectionsList
