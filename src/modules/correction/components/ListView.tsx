import Link from 'next/link'
import { FC, useCallback } from 'react'
import toast from 'react-hot-toast'

import { GenreApiOutput } from '../../../common/model'
import {
  useCorrectionQuery,
  useRemoveCreateGenreMutation,
  useRemoveDeleteGenreMutation,
  useRemoveEditGenreMutation,
} from '../../../common/services/corrections'
import { useCorrectionContext } from '../contexts/CorrectionContext'

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
      <ul className='space-y-2'>
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

  return <div>Loading...</div>
}

const CreateItem: FC<{ genre: GenreApiOutput }> = ({ genre }) => {
  const { id: correctionId } = useCorrectionContext()

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

  return (
    <li className='border border-gray-300'>
      <div className='border-b border-gray-200 px-2 py-1 uppercase text-xs font-semibold text-white bg-green-600'>
        Create
      </div>
      <Link
        href={{
          pathname: `/corrections/${correctionId}/edit/genres/edit`,
          query: { genreId: genre.id },
        }}
      >
        <a className='font-bold text-lg hover:underline px-2 py-1'>
          {genre.name}
        </a>
      </Link>
      <div className='flex justify-between border-t border-gray-200'>
        <Link
          href={{
            pathname: `/corrections/${correctionId}/edit/genres/edit`,
            query: { genreId: genre.id },
          }}
        >
          <a className='border-r border-gray-200 px-2 py-1 uppercase text-xs font-medium text-gray-400 hover:bg-gray-100'>
            Edit
          </a>
        </Link>
        <button
          className='border-l border-gray-200 px-2 py-1 uppercase text-xs font-medium text-gray-400 hover:bg-gray-100 -ml-px'
          type='button'
          onClick={() => handleRemove()}
          disabled={isLoading}
        >
          Remove
        </button>
      </div>
    </li>
  )
}

const EditItem: FC<{
  targetGenre: GenreApiOutput
  updatedGenre: GenreApiOutput
}> = ({ targetGenre, updatedGenre }) => {
  const { id: correctionId } = useCorrectionContext()

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

  const renderName = useCallback(
    () =>
      targetGenre.name !== updatedGenre.name
        ? `${targetGenre.name} -> ${updatedGenre.name}`
        : updatedGenre.name,
    [targetGenre.name, updatedGenre.name]
  )

  return (
    <li className='border border-gray-300'>
      <div className='border-b border-gray-200 px-2 py-1 uppercase text-xs font-semibold text-white bg-blue-600'>
        Edit
      </div>
      <Link
        href={{
          pathname: `/corrections/${correctionId}/edit/genres/edit`,
          query: { genreId: targetGenre.id },
        }}
      >
        <a className='font-bold text-lg hover:underline px-2 py-1'>
          {renderName()}
        </a>
      </Link>
      <div className='flex justify-between border-t border-gray-200'>
        <Link
          href={{
            pathname: `/corrections/${correctionId}/edit/genres/edit`,
            query: { genreId: targetGenre.id },
          }}
        >
          <a className='border-r border-gray-200 px-2 py-1 uppercase text-xs font-medium text-gray-400 hover:bg-gray-100'>
            Edit
          </a>
        </Link>
        <button
          className='border-l border-gray-200 px-2 py-1 uppercase text-xs font-medium text-gray-400 hover:bg-gray-100 -ml-px'
          type='button'
          onClick={() => handleRemove()}
          disabled={isLoading}
        >
          Remove
        </button>
      </div>
    </li>
  )
}

const DeleteItem: FC<{ genre: GenreApiOutput }> = ({ genre }) => {
  const { id: correctionId } = useCorrectionContext()

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

  return (
    <li className='border border-gray-300'>
      <div className='border-b border-gray-200 px-2 py-1 uppercase text-xs font-semibold text-white bg-red-600'>
        Delete
      </div>
      <div className='font-medium text-lg px-2'>{genre.name}</div>
      <div className='flex justify-end border-t border-gray-200'>
        <button
          className='border-l border-gray-200 px-2 py-1 uppercase text-xs font-medium text-gray-400 hover:bg-gray-100 -ml-px'
          type='button'
          onClick={() => handleRemove()}
          disabled={isLoading}
        >
          Remove
        </button>
      </div>
    </li>
  )
}

export default ListView
