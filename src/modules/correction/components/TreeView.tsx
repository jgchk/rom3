import clsx from 'clsx'
import Link from 'next/link'
import { FC, useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'

import useGenreTypeColor from '../../../common/hooks/useGenreTypeColor'
import { genreTypes } from '../../../common/model'
import { genreChildTypes } from '../../../common/model/parents'
import { useDeleteCorrectionGenreMutation } from '../../../common/services/corrections'
import { capitalize } from '../../../common/utils/string'
import { useCorrectionContext } from '../contexts/CorrectionContext'
import { TreeProvider, useGenreTree } from '../contexts/TreeContext'
import useCorrectionGenreTreeQuery, {
  GenreTree,
} from '../hooks/useCorrectionGenreTreeQuery'

const TreeView: FC = () => {
  const { id: correctionId } = useCorrectionContext()
  const { data } = useCorrectionGenreTreeQuery(correctionId)

  if (data) {
    return <Tree tree={data} />
  }

  return <div>Loading...</div>
}

const Tree: FC<{ tree: GenreTree }> = ({ tree }) => {
  const { id: correctionId } = useCorrectionContext()

  const topLevelGenres = useMemo(
    () =>
      Object.values(tree.genres).filter((genre) => genre.parents.length === 0),
    [tree.genres]
  )

  const renderToolbar = useCallback(
    () => (
      <div className={'flex border border-stone-300 bg-white shadow-sm w-fit'}>
        {genreTypes.map((genreType) => (
          <Link
            key={genreType}
            href={{
              pathname: `/corrections/${correctionId}/edit/genres/create`,
              query: { type: genreType },
            }}
          >
            <a className='border-r last:border-0 border-stone-200 px-2 py-1 uppercase text-xs font-medium text-stone-400 hover:bg-stone-100'>
              Add {capitalize(genreType)}
            </a>
          </Link>
        ))}
      </div>
    ),
    [correctionId]
  )

  return (
    <TreeProvider tree={tree}>
      <div className='space-y-4'>
        {renderToolbar()}
        <ul className='space-y-2'>
          {topLevelGenres.map((genre) => (
            <li key={genre.id}>
              <Node id={genre.id} />
            </li>
          ))}
        </ul>
        {topLevelGenres.length > 0 && renderToolbar()}
      </div>
    </TreeProvider>
  )
}

const Node: FC<{ id: number }> = ({ id }) => {
  const { id: correctionId } = useCorrectionContext()
  const tree = useGenreTree()

  const genre = useMemo(() => tree.genres[id], [id, tree.genres])
  const children = useMemo(() => tree.children[id] ?? [], [id, tree.children])

  const childTypes = useMemo(() => genreChildTypes[genre.type], [genre.type])

  const { mutate } = useDeleteCorrectionGenreMutation()
  const handleDelete = useCallback(
    () =>
      mutate(
        { id: correctionId, targetId: id },
        {
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [correctionId, id, mutate]
  )

  const color = useGenreTypeColor(genre.type)

  return (
    <div>
      <div className='border border-stone-300 bg-white shadow-sm'>
        <div className='p-2'>
          <div className={clsx('text-xs font-bold', color)}>{genre.type}</div>
          <div className='text-lg font-medium mt-0.5'>
            <Link
              href={{
                pathname: `/corrections/${correctionId}/edit/genres/edit`,
                query: { genreId: id },
              }}
            >
              <a className='hover:underline'>{genre.name}</a>
            </Link>
          </div>
          <div className='text-sm text-stone-700 mt-1'>{genre.shortDesc}</div>
        </div>
        <div className='flex justify-between border-t border-stone-200'>
          <div className='flex'>
            <Link
              href={{
                pathname: `/corrections/${correctionId}/edit/genres/edit`,
                query: { genreId: id },
              }}
            >
              <a className='border-r border-stone-200 px-2 py-1 uppercase text-xs font-medium text-stone-400 hover:bg-stone-100'>
                Edit
              </a>
            </Link>
            {childTypes.map((childType) => (
              <Link
                key={childType}
                href={{
                  pathname: `/corrections/${correctionId}/edit/genres/create`,
                  query: {
                    type: childType,
                    parentId: id,
                  },
                }}
              >
                <a className='border-r border-stone-200 px-2 py-1 uppercase text-xs font-medium text-stone-400 hover:bg-stone-100'>
                  Add Child {capitalize(childType)}
                </a>
              </Link>
            ))}
          </div>
          <button
            className='border-l border-stone-200 px-2 py-1 uppercase text-xs font-medium text-stone-400 hover:bg-stone-100 -ml-px'
            onClick={() => handleDelete()}
          >
            Delete
          </button>
        </div>
      </div>
      {children.length > 0 && (
        <ul className='mt-2 space-y-2'>
          {children.map((id) => (
            <li className='pl-8' key={id}>
              <Node id={id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TreeView
