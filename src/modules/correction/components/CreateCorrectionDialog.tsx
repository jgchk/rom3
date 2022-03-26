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
        className='bg-white p-2 space-y-2'
        onSubmit={(e) => {
          e.preventDefault()
          handleCreate(name.length === 0 ? undefined : name)
        }}
      >
        <div>
          <label className='block'>Name</label>
          <input
            className='border border-stone-300'
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
        <div className='space-x-2'>
          <button
            className='bg-primary-600 text-white uppercase text-sm font-bold px-2 py-1 rounded-sm'
            type='submit'
            disabled={isLoading}
          >
            Create
          </button>
          <button
            className='text-stone-500 uppercase text-sm font-bold px-1 py-1'
            type='button'
            onClick={() => onClose()}
          >
            Cancel
          </button>
        </div>
      </form>
    </Dialog>
  )
}

export default CreateCorrectionDialog
