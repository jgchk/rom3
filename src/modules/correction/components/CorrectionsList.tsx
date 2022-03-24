import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import {
  CorrectionApiOutput,
  useCorrectionsQuery,
  useDeleteCorrectionMutation,
} from '../../../common/services/corrections'
import { defaultCorrectionName } from '../constants'
import CreateCorrectionDialog from './CreateCorrectionDialog'
import UpdateNameDialog from './UpdateNameDialog'

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
              <Correction key={correction.id} correction={correction} />
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

const Correction: FC<{ correction: CorrectionApiOutput }> = ({
  correction,
}) => {
  const router = useRouter()

  const [showNameDialog, setShowNameDialog] = useState(false)

  const { mutate, isLoading } = useDeleteCorrectionMutation()
  const handleDeleteCorrection = useCallback(() => {
    const conf = confirm('Are you sure? (This action is irreversible)')
    if (!conf) return

    mutate(
      { id: correction.id },
      {
        onSuccess: () => {
          toast.success('Deleted correction')
          void router.push('/corrections')
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }, [correction.id, mutate, router])

  return (
    <>
      <li>
        <Link href={`/corrections/${correction.id}/edit/tree`}>
          <a>{correction.name ?? defaultCorrectionName}</a>
        </Link>
        <button
          onClick={() => setShowNameDialog(true)}
          disabled={showNameDialog}
        >
          Rename
        </button>
        <button onClick={() => handleDeleteCorrection()} disabled={isLoading}>
          Delete
        </button>
      </li>
      {showNameDialog && (
        <UpdateNameDialog
          id={correction.id}
          onClose={() => setShowNameDialog(false)}
        />
      )}
    </>
  )
}
