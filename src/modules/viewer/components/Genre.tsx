import { Genre } from '@prisma/client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

import ButtonPrimary from '../../../common/components/ButtonPrimary'
import ButtonSecondary from '../../../common/components/ButtonSecondary'
import ButtonTertiary from '../../../common/components/ButtonTertiary'
import useGenreTypeColor from '../../../common/hooks/useGenreTypeColor'
import useLoggedInQuery from '../../../common/hooks/useLoggedInQuery'
import { GenreApiOutput } from '../../../common/model'
import { genreChildTypes } from '../../../common/model/parents'
import {
  useCreateCorrectionMutation,
  useDeleteCorrectionGenreMutation,
} from '../../../common/services/corrections'
import { useGenreQuery } from '../../../common/services/genres'

const Genre: FC<{ genreId: number }> = ({ genreId }) => {
  const { data } = useGenreQuery(genreId)

  if (!data) {
    return <div>Loading...</div>
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
      createMutation(
        {},
        {
          onSuccess: (res) => {
            void navigate(`/corrections/${res.id}/genres/${genre.id}/edit`)
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [createMutation, genre.id, navigate]
  )

  const childTypes = useMemo(() => genreChildTypes[genre.type], [genre.type])
  const handleAddChildGenre = useCallback(
    () =>
      createMutation(
        {},
        {
          onSuccess: (res) => {
            void navigate({
              pathname: `/corrections/${res.id}/genres/create`,
              query: { type: childTypes[0], parentId: genre.id },
            })
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [childTypes, createMutation, genre.id, navigate]
  )

  const { mutate: deleteGenre, isLoading: isDeleting } =
    useDeleteCorrectionGenreMutation()
  const handleDelete = useCallback(
    () =>
      createMutation(
        {},
        {
          onSuccess: (res) => {
            deleteGenre(
              { id: res.id, targetId: genre.id },
              {
                onSuccess: () => {
                  const firstParent = genre.parents[0]
                  void navigate(
                    firstParent !== undefined
                      ? `/corrections/${res.id}/genres/${firstParent}`
                      : `/corrections/${res.id}/tree`
                  )
                  toast.success(`Deleted ${genre.name} in new correction`)
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
        }
      ),
    [createMutation, deleteGenre, genre.id, genre.name, genre.parents, navigate]
  )

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

      {isLoggedIn && (
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
  const { data } = useGenreQuery(id)

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Link href={`/genres/${data.id}`}>
        <a className='text-primary-600 font-semibold hover:underline'>
          {data.name}
        </a>
      </Link>

      <p className='text-sm text-stone-600'>{data.shortDesc}</p>
    </div>
  )
}

const Children: FC<{ childIds: number[] }> = ({ childIds }) => (
  <ul className='mt-4 space-y-4'>
    {childIds.map((id) => (
      <li className='pl-6 border-l-2 border-primary-600' key={id}>
        <Child id={id} />
      </li>
    ))}
  </ul>
)

const Child: FC<{ id: number }> = ({ id }) => {
  const { data } = useGenreQuery(id)

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className='py-2'>
        <Link href={`/genres/${data.id}`}>
          <a className='text-primary-600 font-semibold hover:underline'>
            {data.name}
          </a>
        </Link>

        <p className='text-sm text-stone-600'>{data.shortDesc}</p>
      </div>

      <Children childIds={data.children} />
    </div>
  )
}
