import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback } from 'react'
import toast from 'react-hot-toast'

import ButtonSecondary from '../../../common/components/ButtonSecondary'
import { useFromQueryParams } from '../../../common/hooks/useFromQueryParam'
import useLoggedInQuery from '../../../common/hooks/useLoggedInQuery'
import {
  useCreateCorrectionMutation,
  useSubmittedCorrectionsQuery,
} from '../../../common/services/corrections'
import { compareUpdatedAt } from '../utils/correction'
import CorrectionsTable from './CorrectionsTable'

const CorrectionsList: FC = () => {
  const { data: isLoggedIn } = useLoggedInQuery()
  const query = useFromQueryParams()

  const { data } = useSubmittedCorrectionsQuery({
    select: (res) => res.sort(compareUpdatedAt),

    // TODO: Temporarily fixes a race condition where this query would refetch after clicking the confirm
    // button for removing a change. Ideally we build some sort of confirm dialog so focus is not lost.
    refetchOnWindowFocus: false,
  })

  const { mutate, isLoading } = useCreateCorrectionMutation()
  const { push: navigate } = useRouter()
  const handleCreateCorrection = useCallback(
    () =>
      mutate(null, {
        onSuccess: (res) => {
          toast.success('Created new correction')
          void navigate(`/corrections/${res.id}/tree`)
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }),
    [mutate, navigate]
  )

  const renderList = useCallback(() => {
    if (data) {
      return (
        <CorrectionsTable
          corrections={data}
          emptyText='There are no corrections in queue'
        />
      )
    }

    return <div>Loading...</div>
  }, [data])

  return (
    <div className='space-y-4'>
      {isLoggedIn ? (
        <ButtonSecondary
          onClick={() => handleCreateCorrection()}
          disabled={isLoading}
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
  )
}

export default CorrectionsList
