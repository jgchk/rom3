import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import {
  useCorrectionQuery,
  useMergeCorrectionMutation,
  useUpdateCorrectionDraftStatusMutation,
} from '../../../common/services/corrections'
import { defaultCorrectionName } from '../constants'
import { useCorrectionContext } from '../contexts/CorrectionContext'
import useIsMyCorrectionQuery from '../hooks/useIsMyCorrectionQuery'
import UpdateNameDialog from './UpdateNameDialog'

const Navbar: FC = () => {
  const { id } = useCorrectionContext()
  const { data: isMyCorrection } = useIsMyCorrectionQuery(id)

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

  const { mutate: updateDraftStatus, isLoading: isUpdatingDraftStatus } =
    useUpdateCorrectionDraftStatusMutation()
  const handleUpdateDraftStatus = useCallback(
    (draft: boolean) =>
      updateDraftStatus(
        { id, draft },
        {
          onSuccess: (res) => {
            toast.success(res.draft ? 'Set to draft' : 'Set to ready')
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [id, updateDraftStatus]
  )

  return (
    <>
      <div className='flex justify-center bg-primary-600 px-2 h-9 drop-shadow shadow'>
        <div className='flex-1 max-w-screen-lg flex justify-between text-white text-sm min-w-0'>
          <div className='flex items-center min-w-0'>
            <div className='mr-5 font-mackinac font-extrabold text-xl whitespace-nowrap overflow-hidden text-ellipsis'>
              {renderCorrectionName()}
            </div>
            <Link href={`/corrections/${id}/tree`}>
              <a
                className={clsx(
                  'h-full flex items-center border-b-2 px-2 font-semibold hover:bg-primary-700',
                  router.pathname === '/corrections/[id]/tree'
                    ? 'border-white'
                    : 'border-transparent'
                )}
              >
                {isMyCorrection ? 'Edit' : 'Preview'} Tree
              </a>
            </Link>
            <Link href={`/corrections/${id}`}>
              <a
                className={clsx(
                  'h-full flex items-center border-b-2 px-2 font-semibold hover:bg-primary-700',
                  router.pathname === '/corrections/[id]'
                    ? 'border-white'
                    : 'border-transparent'
                )}
              >
                Changelist
              </a>
            </Link>
          </div>
          {isMyCorrection && (
            <div className='flex'>
              <button
                className='h-full flex items-center px-2 font-semibold hover:bg-primary-700'
                onClick={() => handleUpdateDraftStatus(!data?.draft)}
                disabled={isUpdatingDraftStatus}
              >
                {data?.draft ? 'Mark as Ready' : 'Mark as Draft'}
              </button>
              {data && !data.draft && (
                <button
                  className='h-full flex items-center px-2 font-semibold hover:bg-primary-700'
                  onClick={() => handleMergeCorrection()}
                  disabled={isMerging}
                >
                  Merge
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {showNameDialog && (
        <UpdateNameDialog id={id} onClose={() => setShowNameDialog(false)} />
      )}
    </>
  )
}

export default Navbar
