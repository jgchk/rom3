import Link from 'next/link'
import { FC, useCallback, useState } from 'react'
import toast from 'react-hot-toast'

import ButtonSecondary from '../../../common/components/ButtonSecondary'
import { useFromQueryParams } from '../../../common/hooks/useFromQueryParam'
import useLoggedInQuery from '../../../common/hooks/useLoggedInQuery'
import {
  CorrectionApiOutput,
  useDeleteCorrectionMutation,
  useSubmittedCorrectionsQuery,
} from '../../../common/services/corrections'
import { defaultCorrectionName } from '../constants'
import useIsMyCorrectionQuery from '../hooks/useIsMyCorrectionQuery'
import CreateCorrectionDialog from './CreateCorrectionDialog'
import UpdateNameDialog from './UpdateNameDialog'

const CorrectionsList: FC = () => {
  const { data: isLoggedIn } = useLoggedInQuery()
  const query = useFromQueryParams()

  const { data } = useSubmittedCorrectionsQuery({
    select: (res) =>
      res.sort((a, b) =>
        (a.name ?? defaultCorrectionName)
          .toLowerCase()
          .localeCompare((b.name ?? defaultCorrectionName).toLowerCase())
      ),
  })

  const [showNameDialog, setShowNameDialog] = useState(false)

  const renderList = useCallback(() => {
    if (data) {
      return (
        <ul className='space-y-2'>
          {data.map((correction) => (
            <Correction key={correction.id} correction={correction} />
          ))}
        </ul>
      )
    }

    return <div>Loading...</div>
  }, [data])

  return (
    <>
      <div className='space-y-4'>
        {isLoggedIn ? (
          <ButtonSecondary
            onClick={() => setShowNameDialog(true)}
            disabled={!isLoggedIn}
          >
            New Correction
          </ButtonSecondary>
        ) : (
          <div className='text-stone-700'>
            <Link href={{ pathname: '/register', query }}>
              <a className='text-primary-600 font-bold hover:underline'>
                Register
              </a>
            </Link>{' '}
            to create a correction
          </div>
        )}

        {renderList()}
      </div>

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
  const { data: isMyCorrection } = useIsMyCorrectionQuery(correction.id)

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
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }, [correction.id, mutate])

  return (
    <>
      <li className='border border-stone-300 bg-white shadow-sm'>
        <Link href={`/corrections/${correction.id}/tree`}>
          <a className='font-bold text-lg px-2 py-1 hover:underline'>
            {correction.name ?? defaultCorrectionName}
          </a>
        </Link>

        {/* TODO: add small preview of create/edit/delete actions */}

        {isMyCorrection && (
          <div className='flex justify-between border-t border-stone-200'>
            <div className='flex'>
              <Link href={`/corrections/${correction.id}/tree`}>
                <a className='border-r border-stone-200 px-2 py-1 uppercase text-xs font-medium text-stone-400 hover:bg-stone-100'>
                  Edit
                </a>
              </Link>
              <button
                className='border-r border-stone-200 px-2 py-1 uppercase text-xs font-medium text-stone-400 hover:bg-stone-100'
                onClick={() => setShowNameDialog(true)}
                disabled={showNameDialog}
              >
                Rename
              </button>
            </div>
            <button
              className='border-l border-stone-200 px-2 py-1 uppercase text-xs font-medium text-stone-400 hover:bg-stone-100 -ml-px'
              onClick={() => handleDeleteCorrection()}
              disabled={isLoading}
            >
              Delete
            </button>
          </div>
        )}
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
