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

  const renderCreateButton = useCallback(
    () => (
      <button
        className='border border-gray-300 px-2 py-1 uppercase text-xs font-medium text-gray-400 hover:bg-gray-100'
        type='button'
        onClick={() => setShowNameDialog(true)}
      >
        New Correction
      </button>
    ),
    []
  )

  const render = useCallback(() => {
    if (data)
      return (
        <div className='space-y-4'>
          {renderCreateButton()}
          <ul className='space-y-2'>
            {data.map((correction) => (
              <Correction key={correction.id} correction={correction} />
            ))}
          </ul>
          {data.length > 0 && renderCreateButton()}
        </div>
      )

    return <div>Loading...</div>
  }, [data, renderCreateButton])

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
      <li className='border border-gray-300'>
        <Link href={`/corrections/${correction.id}/edit/tree`}>
          <a className='font-bold text-lg hover:underline px-2 py-1'>
            {correction.name ?? defaultCorrectionName}
          </a>
        </Link>
        {/* TODO: add small preview of create/edit/delete actions */}
        <div className='flex justify-between border-t border-gray-200'>
          <div className='flex'>
            <Link href={`/corrections/${correction.id}/edit/tree`}>
              <a className='border-r border-gray-200 px-2 py-1 uppercase text-xs font-medium text-gray-400 hover:bg-gray-100'>
                Edit
              </a>
            </Link>
            <button
              className='border-r border-gray-200 px-2 py-1 uppercase text-xs font-medium text-gray-400 hover:bg-gray-100'
              onClick={() => setShowNameDialog(true)}
              disabled={showNameDialog}
            >
              Rename
            </button>
          </div>
          <button
            className='border-l border-gray-200 px-2 py-1 uppercase text-xs font-medium text-gray-400 hover:bg-gray-100 -ml-px'
            onClick={() => handleDeleteCorrection()}
            disabled={isLoading}
          >
            Delete
          </button>
        </div>
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
