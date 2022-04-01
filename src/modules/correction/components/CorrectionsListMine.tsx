import { useRouter } from 'next/router'
import { FC, useCallback } from 'react'
import toast from 'react-hot-toast'

import ButtonSecondary from '../../../common/components/ButtonSecondary'
import {
  useCreateCorrectionMutation,
  useDraftCorrectionsQuery,
} from '../../../common/services/corrections'
import useAccountSubmittedCorrectionsQuery from '../hooks/useAccountSubmittedCorrectionsQuery'
import { compareUpdatedAt } from '../utils/correction'
import CorrectionsTable from './CorrectionsTable'

const CorrectionsListMine: FC = () => {
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

  return (
    <div className='space-y-4'>
      <ButtonSecondary
        onClick={() => handleCreateCorrection()}
        disabled={isLoading}
      >
        New Correction
      </ButtonSecondary>

      <div>
        <div className='text-lg text-semibold text-stone-600'>Drafts</div>
        <DraftsList />
      </div>

      <div>
        <div className='text-lg text-semibold text-stone-600'>Submitted</div>
        <SubmittedList />
      </div>
    </div>
  )
}

export default CorrectionsListMine

const DraftsList: FC = () => {
  const { data } = useDraftCorrectionsQuery({
    select: (res) => res.sort(compareUpdatedAt),

    // TODO: Temporarily fixes a race condition where this query would refetch after clicking the confirm
    // button for removing a change. Ideally we build some sort of confirm dialog so focus is not lost.
    refetchOnWindowFocus: false,
  })

  if (data) {
    return (
      <CorrectionsTable
        corrections={data}
        emptyText="You don't have any drafts"
      />
    )
  }

  return <div>Loading...</div>
}

const SubmittedList: FC = () => {
  const { data } = useAccountSubmittedCorrectionsQuery({
    select: (res) => res.sort(compareUpdatedAt),

    // TODO: Temporarily fixes a race condition where this query would refetch after clicking the confirm
    // button for removing a change. Ideally we build some sort of confirm dialog so focus is not lost.
    refetchOnWindowFocus: false,
  })

  if (data) {
    return (
      <CorrectionsTable
        corrections={data}
        emptyText="You don't have any submitted corrections"
      />
    )
  }

  return <div>Loading...</div>
}
