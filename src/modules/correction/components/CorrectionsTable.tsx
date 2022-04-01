import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { FC, useCallback, useMemo } from 'react'

import { useAccountQuery } from '../../../common/services/accounts'
import { CorrectionApiOutput } from '../../../common/services/corrections'

const CorrectionsTable: FC<{
  corrections: CorrectionApiOutput[]
  emptyText?: string
}> = ({ corrections, emptyText }) => (
  <table className='bg-white w-full border border-stone-300 shadow-sm table-auto'>
    <thead>
      <tr className='border-b border-stone-200 font-bold text-stone-500 uppercase text-sm tracking-wide'>
        <td className='p-2'>Submitter</td>
        <td className='p-2'>Changes</td>
        <td className='p-2'>Updated</td>
      </tr>
    </thead>
    <tbody>
      {corrections.length > 0 ? (
        corrections.map((correction) => (
          <CorrectionRow key={correction.id} correction={correction} />
        ))
      ) : (
        <tr className='relative'>
          <td className='p-2' colSpan={2}>
            <div className='flex justify-center text-stone-500'>
              {emptyText ?? 'No corrections'}
            </div>
          </td>
        </tr>
      )}
    </tbody>
  </table>
)

const CorrectionRow: FC<{ correction: CorrectionApiOutput }> = ({
  correction,
}) => {
  const { data } = useAccountQuery(correction.creatorId)

  const createdChips = useMemo(
    () =>
      correction.create.map((createdGenre) => (
        <li
          className='whitespace-nowrap border text-sm font-semibold px-2 py-1 bg-green-300 border-green-400 text-green-600'
          key={createdGenre.id}
        >
          + {createdGenre.name}
        </li>
      )),
    [correction.create]
  )

  const editedChips = useMemo(
    () =>
      correction.edit.map(({ updatedGenre }) => (
        <li
          className='whitespace-nowrap border text-sm font-semibold px-2 py-1 bg-blue-300 border-blue-400 text-blue-600'
          key={updatedGenre.id}
        >
          ~ {updatedGenre.name}
        </li>
      )),
    [correction.edit]
  )

  const deletedChips = useMemo(
    () =>
      correction.delete.map((deletedGenre) => (
        <li
          className='whitespace-nowrap border text-sm font-semibold px-2 py-1 bg-red-300 border-red-400 text-red-600'
          key={deletedGenre.id}
        >
          - {deletedGenre.name}
        </li>
      )),
    [correction.delete]
  )

  const chips = useMemo(
    () => [...createdChips, ...editedChips, ...deletedChips],
    [createdChips, deletedChips, editedChips]
  )

  const { push: navigate } = useRouter()
  const handleClick = useCallback(
    () => void navigate(`/corrections/${correction.id}`),
    [correction.id, navigate]
  )

  const date = useMemo(
    () => format(correction.updatedAt, 'PPpp'),
    [correction.updatedAt]
  )

  return (
    <tr
      className='border-b border-stone-200 last:border-none hover:bg-stone-100'
      role='button'
      onClick={() => handleClick()}
    >
      <td className='p-2 text-sm font-medium text-stone-700'>
        {data?.username ?? 'Loading...'}
      </td>
      <td className='p-2'>
        <ul className='flex gap-1 flex-wrap'>{chips}</ul>
      </td>
      <td className='p-2 text-sm font-medium text-stone-700'>{date}</td>
    </tr>
  )
}

export default CorrectionsTable
