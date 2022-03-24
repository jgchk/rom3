import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import Dialog from '../../../common/components/Dialog'
import {
  useCorrectionsQuery,
  useCreateCorrectionMutation,
} from '../../../common/services/corrections'
import FormElement from './forms/elements/FormElement'

const CorrectionsList: FC = () => {
  const { data } = useCorrectionsQuery()

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
                  <a>{correction.name ?? 'Untitled'}</a>
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
        <NameDialog onClose={() => setShowNameDialog(false)} />
      )}
    </>
  )
}

const NameDialog: FC<{
  onClose: () => void
}> = ({ onClose }) => {
  const [name, setName] = useState('')

  const { mutate, isLoading } = useCreateCorrectionMutation()
  const router = useRouter()
  const handleCreate = useCallback(
    (name?: string) =>
      mutate(
        { name },
        {
          onSuccess: (res) => {
            toast.success('Created new correction')
            void router.push(`/corrections/${res.id}/edit/tree`)
            onClose()
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [mutate, onClose, router]
  )

  return (
    <Dialog>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleCreate(name.length === 0 ? undefined : name)
        }}
      >
        <FormElement>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </FormElement>
        <div>
          <button type='submit' disabled={isLoading}>
            Create
          </button>
          <button type='button' onClick={() => onClose()}>
            Cancel
          </button>
        </div>
      </form>
    </Dialog>
  )
}

export default CorrectionsList
