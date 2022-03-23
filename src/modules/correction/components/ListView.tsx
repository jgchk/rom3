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
  const { data } = useCorrectionQuery(correctionId)

  if (data) {
    return (
      <ul>
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
    <li>
      <div>Create</div>
      <Link
        href={{
          pathname: `/corrections/${correctionId}/edit/genres/edit`,
          query: { genreId: genre.id },
        }}
      >
        <a>{genre.name}</a>
      </Link>
      <button onClick={() => handleRemove()} disabled={isLoading}>
        Remove
      </button>
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

  return (
    <li>
      <div>Edit</div>
      <div>
        {targetGenre.name} {'-> '}
        <Link
          href={{
            pathname: `/corrections/${correctionId}/edit/genres/edit`,
            query: { genreId: targetGenre.id },
          }}
        >
          <a>{updatedGenre.name}</a>
        </Link>
      </div>
      <button onClick={() => handleRemove()} disabled={isLoading}>
        Remove
      </button>
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
    <li>
      <div>Delete</div>
      <div>{genre.name}</div>
      <button onClick={() => handleRemove()} disabled={isLoading}>
        Remove
      </button>
    </li>
  )
}

export default ListView
