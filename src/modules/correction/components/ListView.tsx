import Link from 'next/link'
import { FC, useCallback } from 'react'

import { GenreApiOutput } from '../../../common/model'
import {
  useCorrectionQuery,
  useUndoCreateGenreMutation,
  useUndoDeleteGenreMutation,
  useUndoEditGenreMutation,
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

  const { mutate, isLoading } = useUndoCreateGenreMutation()
  const handleUndoCreate = useCallback(
    () => mutate({ id: correctionId, genreId: genre.id }),
    [correctionId, genre.id, mutate]
  )

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
      <button onClick={() => handleUndoCreate()} disabled={isLoading}>
        Undo
      </button>
    </li>
  )
}

const EditItem: FC<{
  targetGenre: GenreApiOutput
  updatedGenre: GenreApiOutput
}> = ({ targetGenre, updatedGenre }) => {
  const { id: correctionId } = useCorrectionContext()

  const { mutate, isLoading } = useUndoEditGenreMutation()
  const handleUndoEdit = useCallback(
    () => mutate({ id: correctionId, targetId: targetGenre.id }),
    [correctionId, mutate, targetGenre.id]
  )

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
      <button onClick={() => handleUndoEdit()} disabled={isLoading}>
        Undo
      </button>
    </li>
  )
}

const DeleteItem: FC<{ genre: GenreApiOutput }> = ({ genre }) => {
  const { id: correctionId } = useCorrectionContext()

  const { mutate, isLoading } = useUndoDeleteGenreMutation()
  const handleUndoDelete = useCallback(
    () => mutate({ id: correctionId, targetId: genre.id }),
    [correctionId, genre.id, mutate]
  )

  return (
    <li>
      <div>Delete</div>
      <div>{genre.name}</div>
      <button onClick={() => handleUndoDelete()} disabled={isLoading}>
        Undo
      </button>
    </li>
  )
}

export default ListView
