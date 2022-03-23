import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback } from 'react'
import toast from 'react-hot-toast'

import {
  useCorrectionsQuery,
  useCreateCorrectionMutation,
} from '../../../common/services/corrections'

const CorrectionsList: FC = () => {
  const { data } = useCorrectionsQuery()

  const { mutate } = useCreateCorrectionMutation()
  const router = useRouter()
  const handleCreate = useCallback(
    () =>
      mutate(null, {
        onSuccess: (res) => {
          toast.success('Created new correction')
          void router.push(`/corrections/${res.id}/edit/tree`)
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }),
    [mutate, router]
  )

  if (data) {
    return (
      <div>
        <button onClick={() => handleCreate()}>Create New</button>
        <ul>
          {data.map((correction) => (
            <li key={correction.id}>
              <Link href={`/corrections/${correction.id}/edit/tree`}>
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
