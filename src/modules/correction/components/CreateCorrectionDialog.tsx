import { useRouter } from 'next/router'
import { FC, useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import Dialog from '../../../common/components/Dialog'
import { useCreateCorrectionMutation } from '../../../common/services/corrections'

const CreateCorrectionDialog: FC<{
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
        <div>
          <label className='block'>Name</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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

export default CreateCorrectionDialog
