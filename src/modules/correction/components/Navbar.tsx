import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { RiEditFill } from 'react-icons/ri'

import {
  useCorrectionQuery,
  useDeleteCorrectionMutation,
  useMergeCorrectionMutation,
} from '../../../common/services/corrections'
import { defaultCorrectionName } from '../constants'
import { useCorrectionContext } from '../contexts/CorrectionContext'
import UpdateNameDialog from './UpdateNameDialog'

const Navbar: FC = () => {
  const { id } = useCorrectionContext()

  const { data } = useCorrectionQuery(id)

  const renderCorrectionName = useCallback(() => {
    if (data) return data.name ?? defaultCorrectionName
    return 'Loading...'
  }, [data])

  const [showNameDialog, setShowNameDialog] = useState(false)

  const { mutate: mergeCorrection, isLoading: isMerging } =
    useMergeCorrectionMutation()
  const router = useRouter()
  const handleMergeCorrection = useCallback(() => {
    const conf = confirm('Are you sure? (This action is irreversible)')
    if (!conf) return

    mergeCorrection(
      { id },
      {
        onSuccess: () => {
          toast.success('Merged correction!')
          void router.push('/corrections')
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }, [id, mergeCorrection, router])

  const { mutate: deleteCorrection, isLoading: isDeleting } =
    useDeleteCorrectionMutation()
  const handleDeleteCorrection = useCallback(() => {
    const conf = confirm('Are you sure? (This action is irreversible)')
    if (!conf) return

    deleteCorrection(
      { id },
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
  }, [deleteCorrection, id, router])

  return (
    <>
      <div className='flex justify-center bg-primary-600 px-2 h-9 shadow'>
        <div className='flex-1 max-w-screen-lg flex justify-between text-white text-sm'>
          <div className='flex items-center'>
            <div className='flex items-center space-x-2 mr-5'>
              <div className='font-mackinac font-extrabold text-xl'>
                {renderCorrectionName()}
              </div>
              <button
                className='rounded-full w-6 h-6 flex items-center justify-center hover:bg-primary-700'
                onClick={() => setShowNameDialog(true)}
                disabled={showNameDialog}
              >
                <RiEditFill />
              </button>
            </div>
            <Link href={`/corrections/${id}/edit/tree`}>
              <a
                className={clsx(
                  'h-full flex items-center border-b-2 px-2 font-bold hover:bg-primary-700',
                  router.pathname === '/corrections/[id]/edit/tree'
                    ? 'border-white'
                    : 'border-transparent'
                )}
              >
                Tree
              </a>
            </Link>
            <Link href={`/corrections/${id}/edit`}>
              <a
                className={clsx(
                  'h-full flex items-center border-b-2 px-2 font-bold hover:bg-primary-700',
                  router.pathname === '/corrections/[id]/edit'
                    ? 'border-white'
                    : 'border-transparent'
                )}
              >
                Changelist
              </a>
            </Link>
          </div>
          <div className='flex'>
            <button
              className='h-full flex items-center px-2 font-bold hover:bg-primary-700'
              onClick={() => handleDeleteCorrection()}
              disabled={isDeleting}
            >
              Delete
            </button>
            <button
              className='h-full flex items-center px-2 font-bold hover:bg-primary-700'
              onClick={() => handleMergeCorrection()}
              disabled={isMerging}
            >
              Merge
            </button>
          </div>
        </div>
      </div>
      {showNameDialog && (
        <UpdateNameDialog id={id} onClose={() => setShowNameDialog(false)} />
      )}
    </>
  )
}

export default Navbar
