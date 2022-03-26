import { FC, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import Dialog from '../../../common/components/Dialog'
import {
  CorrectionApiOutput,
  useUpdateCorrectionNameMutation,
} from '../../../common/services/corrections'
import { trpcClient } from '../../../common/utils/trpc'
import { defaultCorrectionName } from '../constants'

const UpdateNameDialog: FC<{
  id: number
  onClose: () => void
}> = ({ id, onClose }) => {
  const [correction, setCorrection] = useState<CorrectionApiOutput>()
  const fetchCorrection = useCallback(async () => {
    const data = await trpcClient.query('corrections.byId', { id })
    setCorrection(data)
  }, [id])
  useEffect(() => void fetchCorrection(), [fetchCorrection])

  const renderContents = useCallback(() => {
    if (correction)
      return <Loaded id={id} initialName={correction.name} onClose={onClose} />

    // TODO: better loading state. maybe show input but disabled with placeholder cached data
    return <div>Loading...</div>
  }, [correction, id, onClose])

  return <Dialog>{renderContents()}</Dialog>
}

const Loaded: FC<{
  id: number
  initialName: string | null
  onClose: () => void
}> = ({ id, initialName, onClose }) => {
  const [name, setName] = useState(initialName ?? '')

  const { mutate, isLoading } = useUpdateCorrectionNameMutation()
  const handleUpdate = useCallback(
    (name?: string) =>
      mutate(
        { id, name },
        {
          onSuccess: (res) => {
            toast.success(
              `Renamed correction to ${res.name ?? defaultCorrectionName}`
            )
            onClose()
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [id, mutate, onClose]
  )

  return (
    <form
      className='bg-white p-6 border border-stone-300 space-y-2'
      onSubmit={(e) => {
        e.preventDefault()
        handleUpdate(name.length === 0 ? undefined : name)
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
          Update
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
  )
}

export default UpdateNameDialog
