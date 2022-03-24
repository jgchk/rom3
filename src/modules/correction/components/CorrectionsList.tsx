import Link from 'next/link'
import { FC, useCallback, useState } from 'react'

import { useCorrectionsQuery } from '../../../common/services/corrections'
import { defaultCorrectionName } from '../constants'
import CreateCorrectionDialog from './CreateCorrectionDialog'

const CorrectionsList: FC = () => {
  const { data } = useCorrectionsQuery({
    select: (res) =>
      res.sort((a, b) =>
        (a.name ?? defaultCorrectionName)
          .toLowerCase()
          .localeCompare((b.name ?? defaultCorrectionName).toLowerCase())
      ),
  })

  const [showNameDialog, setShowNameDialog] = useState(false)

  const render = useCallback(() => {
    if (data)
      return (
        <div>
          <button onClick={() => setShowNameDialog(true)}>Create New</button>
          <ul>
            {data.map((correction) => (
              <li key={correction.id}>
                <Link href={`/corrections/${correction.id}/edit/tree`}>
                  <a>{correction.name ?? defaultCorrectionName}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )

    return <div>Loading...</div>
  }, [data])

  return (
    <>
      {render()}
      {showNameDialog && (
        <CreateCorrectionDialog onClose={() => setShowNameDialog(false)} />
      )}
    </>
  )
}

export default CorrectionsList
