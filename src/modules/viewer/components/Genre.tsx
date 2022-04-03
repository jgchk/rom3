import { Genre } from '@prisma/client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import ReactMarkdown from 'react-markdown'

import ButtonPrimary from '../../../common/components/ButtonPrimary'
import ButtonSecondary from '../../../common/components/ButtonSecondary'
import ButtonTertiary from '../../../common/components/ButtonTertiary'
import Loader from '../../../common/components/Loader'
import { useFromQueryParams } from '../../../common/hooks/useFromQueryParam'
import useGenreTypeColor from '../../../common/hooks/useGenreTypeColor'
import useLoggedInQuery from '../../../common/hooks/useLoggedInQuery'
import { GenreApiOutput } from '../../../common/model'
import { genreChildTypes } from '../../../common/model/parents'
import {
  useCreateCorrectionMutation,
  useDeleteCorrectionGenreMutation,
} from '../../../common/services/corrections'
import { useGenreQuery } from '../../../common/services/genres'
import Hierarchy from './Hierarchy'

const Genre: FC<{ genreId: number }> = ({ genreId }) => {
  const { data } = useGenreQuery(genreId)

  if (!data) {
    return <Loader size={32} className='text-stone-600' />
  }

  return <Loaded genre={data} />
}

const Loaded: FC<{
  genre: GenreApiOutput
}> = ({ genre }) => {
  const [expanded, setExpanded] = useState(false)
  const { data: isLoggedIn } = useLoggedInQuery()

  const color = useGenreTypeColor(genre.type)

  const { mutate: createMutation, isLoading: isCreatingCorrection } =
    useCreateCorrectionMutation()
  const { push: navigate } = useRouter()
  const handleEditGenre = useCallback(
    () =>
      createMutation(null, {
        onSuccess: (res) => {
          void navigate(`/corrections/${res.id}/genres/${genre.id}/edit`)
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }),
    [createMutation, genre.id, navigate]
  )

  const childTypes = useMemo(() => genreChildTypes[genre.type], [genre.type])
  const handleAddChildGenre = useCallback(
    () =>
      createMutation(null, {
        onSuccess: (res) => {
          void navigate({
            pathname: `/corrections/${res.id}/genres/create`,
            query: { type: childTypes[0], parentId: genre.id },
          })
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }),
    [childTypes, createMutation, genre.id, navigate]
  )

  const { mutate: deleteGenre, isLoading: isDeleting } =
    useDeleteCorrectionGenreMutation()
  const handleDelete = useCallback(
    () =>
      createMutation(null, {
        onSuccess: (res) => {
          deleteGenre(
            { id: res.id, targetId: genre.id },
            {
              onSuccess: () => {
                void navigate(`/corrections/${res.id}/genres/${genre.id}`)
              },
              onError: (error) => {
                toast.error(error.message)
              },
            }
          )
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }),
    [createMutation, deleteGenre, genre.id, navigate]
  )

  const query = useFromQueryParams()

  return (
    <div className='space-y-4'>
      <Breadcrumbs genre={genre} />

      <div className='bg-white border border-stone-300 shadow-sm p-5'>
        <div className='text-xs font-bold'>
          <span className={color}>{genre.type}</span>
          {genre.trial && (
            <>
              {' '}
              <span className='text-stone-500'>(TRIAL)</span>
            </>
          )}
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

      <Hierarchy genre={genre} />

      {isLoggedIn ? (
        <div>
          <ButtonPrimary
            onClick={() => handleEditGenre()}
            disabled={isCreatingCorrection}
          >
            Edit
          </ButtonPrimary>
          {childTypes.length > 0 && (
            <ButtonSecondary
              className='ml-1.5'
              onClick={() => handleAddChildGenre()}
              disabled={isCreatingCorrection}
            >
              Add Child
            </ButtonSecondary>
          )}
          <ButtonTertiary onClick={() => handleDelete()} disabled={isDeleting}>
            Delete
          </ButtonTertiary>
        </div>
      ) : (
        <div className='text-stone-700 mt-4'>
          <Link href={{ pathname: '/register', query }}>
            <a className='text-primary-600 font-bold hover:underline'>
              Register
            </a>
          </Link>{' '}
          to edit this page
        </div>
      )}
    </div>
  )
}

export default Genre

const Description: FC<{
  genre: GenreApiOutput
  expanded: boolean
  onExpandChange: (expanded: boolean) => void
}> = ({ genre, expanded, onExpandChange }) => {
  if (genre.shortDesc && genre.longDesc) {
    return (
      <div className='mt-3'>
        {expanded ? (
          <ReactMarkdown className='prose prose-stone'>
            {genre.longDesc}
          </ReactMarkdown>
        ) : (
          <p>{genre.shortDesc}</p>
        )}
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
        {expanded && (
          <ReactMarkdown className='prose prose-stone'>
            {genre.longDesc}
          </ReactMarkdown>
        )}
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
  return (
    <ol className='flex items-center text-sm text-stone-500'>
      <li>
        <Link href='/genres/tree'>
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
  const { data } = useGenreQuery(id)

  return (
    <Link href={`/genres/${id}`}>
      <a className='text-sm text-stone-500 font-medium inline-flex items-center px-2 py-1 hover:underline'>
        {data ? data.name : 'Loading...'}
      </a>
    </Link>
  )
}
