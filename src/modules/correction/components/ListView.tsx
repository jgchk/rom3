import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import { RiArrowRightSLine } from 'react-icons/ri'

import Loader from '../../../common/components/Loader'
import { GenreApiOutput } from '../../../common/model'
import {
  useCorrectionQuery,
  useRemoveCreateGenreMutation,
  useRemoveDeleteGenreMutation,
  useRemoveEditGenreMutation,
} from '../../../common/services/corrections'
import { useCorrectionContext } from '../contexts/CorrectionContext'
import useIsMyCorrectionQuery from '../hooks/useIsMyCorrectionQuery'
import { getTopbarColor, getTopbarText } from '../utils/display'

const ListView: FC = () => {
  const { id: correctionId } = useCorrectionContext()
  const { data } = useCorrectionQuery(correctionId, {
    // TODO: Temporarily fixes a race condition where this query would refetch after clicking the confirm
    // button for removing a change. Ideally we build some sort of confirm dialog so focus is not lost.
    refetchOnWindowFocus: false,
  })

  if (data) {
    if (
      data.create.length === 0 &&
      data.edit.length === 0 &&
      data.delete.length === 0
    ) {
      return <div>No changes</div>
    }

    return (
      <ul className='space-y-4'>
        {data.create.map((genre) => (
          <CreateItem key={genre.id} genre={genre} />
        ))}
        {data.edit.map(({ targetGenre, updatedGenre }) => (
          <EditItem
            key={`${targetGenre.id}_${updatedGenre.id}`}
            targetGenre={targetGenre}
            updatedGenre={updatedGenre}
          />
        ))}
        {data.delete.map((genre) => (
          <DeleteItem key={genre.id} genre={genre} />
        ))}
      </ul>
    )
  }

  return <Loader size={32} className='text-stone-600' />
}

const CreateItem: FC<{ genre: GenreApiOutput }> = ({ genre }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data: isMyCorrection } = useIsMyCorrectionQuery(correctionId)

  const { asPath } = useRouter()

  const { mutate, isLoading } = useRemoveCreateGenreMutation()
  const handleRemove = useCallback(() => {
    const conf = confirm('Are you sure? (This action is irreversible)')
    if (!conf) return

    mutate(
      { id: correctionId, genreId: genre.id },
      {
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }, [correctionId, genre.id, mutate])

  const topbarText = useMemo(() => getTopbarText('created'), [])
  const topbarColor = useMemo(() => getTopbarColor('created'), [])

  return (
    <li className='border border-stone-300 bg-white shadow-sm'>
      <div
        className={clsx(
          'border-b border-stone-200 px-2 py-1 uppercase text-xs font-bold',
          topbarColor
        )}
      >
        {topbarText}
      </div>

      <div className='p-5'>
        <div className='text-xs font-bold text-stone-500'>
          {genre.type}
          {genre.trial && <> (TRIAL)</>}
        </div>
        <div className='text-lg font-medium mt-0.5'>
          <Link href={`/corrections/${correctionId}/genres/${genre.id}`}>
            <a className='hover:underline'>{genre.name}</a>
          </Link>
        </div>
        <p className='text-sm text-stone-700 mt-1'>{genre.shortDesc}</p>
      </div>

      {isMyCorrection && (
        <div className='flex justify-between border-t border-stone-200'>
          <Link
            href={{
              pathname: `/corrections/${correctionId}/genres/${genre.id}/edit`,
              query: { from: asPath },
            }}
          >
            <a className='border-r border-stone-200 px-2 py-1 uppercase text-xs font-medium text-stone-400 hover:bg-stone-100'>
              Edit
            </a>
          </Link>
          <button
            className='border-l border-stone-200 px-2 py-1 uppercase text-xs font-medium text-stone-400 hover:bg-stone-100 -ml-px'
            type='button'
            onClick={() => handleRemove()}
            disabled={isLoading}
          >
            Undo
          </button>
        </div>
      )}
    </li>
  )
}

const EditItem: FC<{
  targetGenre: GenreApiOutput
  updatedGenre: GenreApiOutput
}> = ({ targetGenre, updatedGenre }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data: isMyCorrection } = useIsMyCorrectionQuery(correctionId)

  const { asPath } = useRouter()

  const { mutate, isLoading } = useRemoveEditGenreMutation()
  const handleRemove = useCallback(() => {
    const conf = confirm('Are you sure? (This action is irreversible)')
    if (!conf) return

    mutate(
      { id: correctionId, updatedGenreId: updatedGenre.id },
      {
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }, [correctionId, mutate, updatedGenre.id])

  const type = useMemo(() => {
    if (
      targetGenre.type !== updatedGenre.type ||
      targetGenre.trial !== updatedGenre.trial
    ) {
      return (
        <div className='flex items-center space-x-1'>
          <div className='line-through'>
            {targetGenre.type}
            {targetGenre.trial && <> (TRIAL)</>}
          </div>
          <RiArrowRightSLine />
          <div>
            {updatedGenre.type}
            {updatedGenre.trial && <> (TRIAL)</>}
          </div>
        </div>
      )
    }

    return (
      <>
        {updatedGenre.type}
        {updatedGenre.trial && <> (TRIAL)</>}
      </>
    )
  }, [
    targetGenre.trial,
    targetGenre.type,
    updatedGenre.trial,
    updatedGenre.type,
  ])

  const name = useMemo(() => {
    if (targetGenre.name !== updatedGenre.name) {
      return (
        <div className='flex items-center space-x-1'>
          <div className='line-through'>{targetGenre.name}</div>
          <RiArrowRightSLine />
          <div>{updatedGenre.name}</div>
        </div>
      )
    }

    return updatedGenre.name
  }, [targetGenre.name, updatedGenre.name])

  const shortDesc = useMemo(() => {
    if (targetGenre.shortDesc !== updatedGenre.shortDesc) {
      return (
        <div className='flex items-center space-x-1'>
          <div className='line-through'>{targetGenre.shortDesc}</div>
          <RiArrowRightSLine />
          <div>{updatedGenre.shortDesc}</div>
        </div>
      )
    }

    return updatedGenre.shortDesc
  }, [targetGenre.shortDesc, updatedGenre.shortDesc])

  const topbarText = useMemo(() => getTopbarText('edited'), [])
  const topbarColor = useMemo(() => getTopbarColor('edited'), [])

  return (
    <li className='border border-stone-300 bg-white shadow-sm'>
      <div
        className={clsx(
          'border-b border-stone-200 px-2 py-1 uppercase text-xs font-bold',
          topbarColor
        )}
      >
        {topbarText}
      </div>

      <div className='p-5'>
        <div className={'text-xs font-bold text-stone-500'}>{type}</div>
        <div className='text-lg font-medium mt-0.5'>
          <Link href={`/corrections/${correctionId}/genres/${targetGenre.id}`}>
            <a className='hover:underline'>{name}</a>
          </Link>
        </div>
        <p className='text-sm text-stone-700 mt-1'>{shortDesc}</p>
      </div>

      {isMyCorrection && (
        <div className='flex justify-between border-t border-stone-200'>
          <Link
            href={{
              pathname: `/corrections/${correctionId}/genres/${targetGenre.id}/edit`,
              query: { from: asPath },
            }}
          >
            <a className='border-r border-stone-200 px-2 py-1 uppercase text-xs font-medium text-stone-400 hover:bg-stone-100'>
              Edit
            </a>
          </Link>
          <button
            className='border-l border-stone-200 px-2 py-1 uppercase text-xs font-medium text-stone-400 hover:bg-stone-100 -ml-px'
            type='button'
            onClick={() => handleRemove()}
            disabled={isLoading}
          >
            Undo
          </button>
        </div>
      )}
    </li>
  )
}

const DeleteItem: FC<{ genre: GenreApiOutput }> = ({ genre }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data: isMyCorrection } = useIsMyCorrectionQuery(correctionId)

  const { mutate, isLoading } = useRemoveDeleteGenreMutation()
  const handleRemove = useCallback(() => {
    const conf = confirm('Are you sure? (This action is irreversible)')
    if (!conf) return

    mutate(
      { id: correctionId, targetId: genre.id },
      {
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }, [correctionId, genre.id, mutate])

  const topbarText = useMemo(() => getTopbarText('deleted'), [])
  const topbarColor = useMemo(() => getTopbarColor('deleted'), [])

  return (
    <li className='border border-stone-300 bg-white shadow-sm'>
      <div
        className={clsx(
          'border-b border-stone-200 px-2 py-1 uppercase text-xs font-bold',
          topbarColor
        )}
      >
        {topbarText}
      </div>

      <div className='p-5'>
        <div className='text-xs font-bold text-stone-500 line-through'>
          {genre.type}
          {genre.trial && <> (TRIAL)</>}
        </div>
        <div className='text-lg font-medium mt-0.5 line-through'>
          {genre.name}
        </div>
        <p className='text-sm text-stone-700 mt-1 line-through'>
          {genre.shortDesc}
        </p>
      </div>

      {isMyCorrection && (
        <div className='flex justify-end border-t border-stone-200'>
          <button
            className='border-l border-stone-200 px-2 py-1 uppercase text-xs font-medium text-stone-400 hover:bg-stone-100 -ml-px'
            type='button'
            onClick={() => handleRemove()}
            disabled={isLoading}
          >
            Undo
          </button>
        </div>
      )}
    </li>
  )
}

export default ListView
