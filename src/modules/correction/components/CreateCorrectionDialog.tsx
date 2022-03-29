import { useRouter } from 'next/router'
import { FC, useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import ButtonPrimary from '../../../common/components/ButtonPrimary'
import ButtonTertiary from '../../../common/components/ButtonTertiary'
import Dialog from '../../../common/components/Dialog'
import Input from '../../../common/components/Input'
import Label from '../../../common/components/Label'
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
            void router.push(`/corrections/${res.id}/tree`)
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
        className='bg-white p-4 border border-stone-300 space-y-2'
        onSubmit={(e) => {
          e.preventDefault()
          handleCreate(name.length === 0 ? undefined : name)
        }}
      >
        <div>
          <Label>Name</Label>
          <Input
            className='border border-stone-300'
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
        <div className='space-x-1'>
          <ButtonPrimary type='submit' disabled={isLoading}>
            Create
          </ButtonPrimary>
          <ButtonTertiary type='button' onClick={() => onClose()}>
            Cancel
          </ButtonTertiary>
        </div>
      </form>
    </Dialog>
  )
}

export default CreateCorrectionDialog
