import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import Dialog from '../../../common/components/Dialog'
import {
  CorrectionApiOutput,
  useUpdateCorrectionNameMutation,
} from '../../../common/services/corrections'
import { trpcClient } from '../../../common/utils/trpc'
import { useCorrectionContext } from '../contexts/CorrectionContext'
import FormElement from './forms/elements/FormElement'

const UpdateNameDialog: FC<{
  onClose: () => void
}> = ({ onClose }) => {
  const { id } = useCorrectionContext()

  const [correction, setCorrection] = useState<CorrectionApiOutput>()
  const fetchCorrection = useCallback(async () => {
    const data = await trpcClient.query('corrections.byId', { id })
    setCorrection(data)
  }, [id])
  useEffect(() => void fetchCorrection(), [fetchCorrection])

  const renderContents = useCallback(() => {
    if (correction)
      return <Loaded initialName={correction.name} onClose={onClose} />

    // TODO: better loading state. maybe show input but disabled with placeholder cached data
    return <div>Loading...</div>
  }, [correction, onClose])

  return <Dialog>{renderContents()}</Dialog>
}

const Loaded: FC<{ initialName: string | null; onClose: () => void }> = ({
  initialName,
  onClose,
}) => {
  const { id } = useCorrectionContext()
  const router = useRouter()

  const [name, setName] = useState(initialName ?? '')

  const { mutate, isLoading } = useUpdateCorrectionNameMutation()
  const handleUpdate = useCallback(
    (name?: string) =>
      mutate(
        { id, name },
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
    [id, mutate, onClose, router]
  )

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleUpdate(name.length === 0 ? undefined : name)
      }}
    >
      <FormElement>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </FormElement>
      <div>
        <button type='submit' disabled={isLoading}>
          Update
        </button>
        <button type='button' onClick={() => onClose()}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default UpdateNameDialog
