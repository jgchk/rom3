import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

import { ButtonPrimaryLink } from '../../../common/components/ButtonPrimary'
import { ButtonSecondaryLink } from '../../../common/components/ButtonSecondary'
import ButtonTertiary from '../../../common/components/ButtonTertiary'
import { GenreApiOutput } from '../../../common/model'
import { genreChildTypes } from '../../../common/model/parents'
import { useDeleteCorrectionGenreMutation } from '../../../common/services/corrections'
import { useCorrectionContext } from '../contexts/CorrectionContext'
import useCorrectionGenreQuery, {
  CorrectionGenre,
} from '../hooks/useCorrectionGenreQuery'
import useIsMyCorrectionQuery from '../hooks/useIsMyCorrectionQuery'
import {
  getChangeBorderColor,
  getChangeTextColor,
  getTopbarColor,
  getTopbarText,
} from '../utils/display'

const ViewView: FC<{ genreId: number }> = ({ genreId }) => {
  const { id: correctionId } = useCorrectionContext()

  const { data } = useCorrectionGenreQuery(genreId, correctionId)

  if (!data) {
    return <div>Loading...</div>
  }

  return <Loaded genre={data} />
}

const Loaded: FC<{
  genre: CorrectionGenre
}> = ({ genre }) => {
  const [expanded, setExpanded] = useState(false)

  const { id: correctionId } = useCorrectionContext()
  const { data: isMyCorrection } = useIsMyCorrectionQuery(correctionId)

  const { push: navigate, asPath } = useRouter()

  const topbarText: string = useMemo(
    () => getTopbarText(genre.changes),
    [genre.changes]
  )
  const topbarColor: string = useMemo(
    () => getTopbarColor(genre.changes),
    [genre.changes]
  )

  const childTypes = useMemo(() => genreChildTypes[genre.type], [genre.type])

  const { mutate, isLoading: isDeleting } = useDeleteCorrectionGenreMutation()
  const handleDelete = useCallback(
    () =>
      mutate(
        { id: correctionId, targetId: genre.id },
        {
          onSuccess: () => {
            void navigate(`/corrections/${correctionId}/genres/${genre.id}`)
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [correctionId, genre.id, mutate, navigate]
  )

  return (
    <div className='space-y-4'>
      <Breadcrumbs genre={genre} />

      <div className='bg-white border border-stone-300 shadow-sm'>
        <div
          className={clsx(
            'border-b border-stone-200 px-2 py-1 uppercase text-xs font-bold flex items-stretch',
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
          <div className='text-2xl font-medium mt-0.5'>{genre.name}</div>
          {genre.alternateNames.length > 0 && (
            <div className='text-stone-600 font-medium text-sm mt-1'>
              AKA: {genre.alternateNames.join(', ')}
            </div>
          )}
          {genre.locations.length > 0 && (
            <div className='text-stone-600 font-medium text-sm mt-1'>
              Locations:{' '}
              {genre.locations.map((loc) =>
                [loc.city, loc.country, loc.region]
                  .filter((s) => s.length > 0)
                  .join(', ')
              )}
            </div>
          )}
          {genre.cultures.length > 0 && (
            <div className='text-stone-600 font-medium text-sm mt-1'>
              Cultures: {genre.cultures.join(', ')}
            </div>
          )}
          <Description
            genre={genre}
            expanded={expanded}
            onExpandChange={(expanded) => setExpanded(expanded)}
          />
        </div>
      </div>

      <Hierarchy genre={genre} />

      {isMyCorrection && (
        <div>
          <ButtonPrimaryLink
            href={{
              pathname: `/corrections/${correctionId}/genres/${genre.id}/edit`,
              query: { from: asPath },
            }}
          >
            Edit
          </ButtonPrimaryLink>
          {childTypes.length > 0 && (
            <ButtonSecondaryLink
              className='ml-1.5'
              href={{
                pathname: `/corrections/${correctionId}/genres/create`,
                query: {
                  type: childTypes[0],
                  parentId: genre.id,
                  from: asPath,
                },
              }}
            >
              Add Child
            </ButtonSecondaryLink>
          )}
          {genre.changes !== 'deleted' && (
            <ButtonTertiary
              onClick={() => handleDelete()}
              disabled={isDeleting}
            >
              Delete
            </ButtonTertiary>
          )}
        </div>
      )}
    </div>
  )
}

export default ViewView

const Description: FC<{
  genre: GenreApiOutput
  expanded: boolean
  onExpandChange: (expanded: boolean) => void
}> = ({ genre, expanded, onExpandChange }) => {
  if (genre.shortDesc && genre.longDesc) {
    return (
      <div className='mt-3'>
        {/* TODO: render markdown for long desc */}
        <p>{expanded ? genre.longDesc : genre.shortDesc}</p>
        <button
          className='text-sm font-semibold text-stone-700 hover:text-primary-600'
          onClick={() => onExpandChange(!expanded)}
        >
          {expanded ? 'Show Short Description' : 'Show Long Description'}
        </button>
      </div>
    )
  }

  if (genre.shortDesc) {
    return <p className='mt-3'>{genre.shortDesc}</p>
  }

  if (genre.longDesc) {
    return (
      <div className='mt-3'>
        {/* TODO: render markdown for long desc */}
        {expanded && <p>{genre.longDesc}</p>}
        <button
          className='text-sm font-semibold text-stone-700 hover:text-primary-600'
          onClick={() => onExpandChange(!expanded)}
        >
          {expanded ? 'Show Short Description' : 'Show Long Description'}
        </button>
      </div>
    )
  }

  return null
}

const Breadcrumbs: FC<{ genre: GenreApiOutput }> = ({ genre }) => {
  const { id: correctionId } = useCorrectionContext()

  return (
    <ol className='flex items-center text-sm text-stone-500'>
      <li>
        <Link href={`/corrections/${correctionId}/tree`}>
          <a className='font-medium group flex items-center px-2 py-1'>
            <HiChevronLeft className='mr-1' />
            <span className='group-hover:underline'>All Genres</span>
          </a>
        </Link>
      </li>
      {genre.parents.length > 0 && <HiChevronRight />}
      {genre.parents.map((id, i) => (
        <li key={id}>
          {i !== 0 && '|'}
          <Breadcrumb id={id} />
        </li>
      ))}
      <HiChevronRight />
      <div className='font-semibold px-2 py-1'>{genre.name}</div>
    </ol>
  )
}

const Breadcrumb: FC<{ id: number }> = ({ id }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data } = useCorrectionGenreQuery(id, correctionId)

  return (
    <Link href={`/corrections/${correctionId}/genres/${id}`}>
      <a className='text-sm text-stone-500 font-medium inline-flex items-center px-2 py-1 hover:underline'>
        {data ? data.name : 'Loading...'}
      </a>
    </Link>
  )
}

const Hierarchy: FC<{ genre: GenreApiOutput }> = ({ genre }) => (
  <div className='bg-white shadow-sm border border-stone-300'>
    <div className='px-2 py-1 text-stone-600 font-medium border-b border-stone-200'>
      Hierarchy
    </div>
    <ul className='px-6 pt-5 pb-3 space-y-4'>
      {genre.parents.map((id) => (
        <li key={id}>
          <Parent id={id} />
        </li>
      ))}

      <li>
        <div className='text-stone-600 font-medium text-lg'>{genre.name}</div>

        <Children childIds={genre.children} />
      </li>
    </ul>
  </div>
)

const Parent: FC<{ id: number }> = ({ id }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data } = useCorrectionGenreQuery(id, correctionId)

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div className='py-1'>
      <Link href={`/corrections/${correctionId}/genres/${id}`}>
        <a
          className={clsx(
            'font-semibold hover:underline',
            getChangeTextColor(data.changes)
          )}
        >
          {data.name}
        </a>
      </Link>

      <p className='text-sm text-stone-500'>{data.shortDesc}</p>
    </div>
  )
}

const Children: FC<{ childIds: number[] }> = ({ childIds }) => (
  <ul className='mt-4 space-y-4'>
    {childIds.map((id) => (
      <Child key={id} id={id} />
    ))}
  </ul>
)

const Child: FC<{ id: number }> = ({ id }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data } = useCorrectionGenreQuery(id, correctionId)

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <li className={clsx('pl-6 border-l-2', getChangeBorderColor(data.changes))}>
      <div className='py-2'>
        <Link href={`/corrections/${correctionId}/genres/${id}`}>
          <a
            className={clsx(
              'font-semibold hover:underline',
              getChangeTextColor(data.changes)
            )}
          >
            {data.name}
          </a>
        </Link>

        <p className='text-sm text-stone-500'>{data.shortDesc}</p>
      </div>

      <Children childIds={data.children} />
    </li>
  )
}
