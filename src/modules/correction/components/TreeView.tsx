import clsx from 'clsx'
import Link from 'next/link'
import { FC, useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'

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
    (className: string) => (
      <div className={clsx('flex border border-gray-300', className)}>
        {genreTypes.map((genreType) => (
          <Link
            key={genreType}
            href={{
              pathname: `/corrections/${correctionId}/edit/genres/create`,
              query: { type: genreType },
            }}
          >
            <a className='border-r border-gray-200 px-2 py-1 uppercase text-xs font-medium text-gray-400 hover:bg-gray-100'>
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
      {renderToolbar('mb-4')}
      <ul className='space-y-4'>
        {topLevelGenres.map((genre) => (
          <li key={genre.id}>
            <Node id={genre.id} />
          </li>
        ))}
      </ul>
      {topLevelGenres.length > 0 && renderToolbar('mt-4')}
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
          onSuccess: () => {
            toast.success(`Deleted ${genre.name} in correction`)
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [correctionId, genre.name, id, mutate]
  )

  return (
    <div>
      <div className='border border-gray-300'>
        <div>
          <div className='px-2 py-1'>
            <Link
              href={{
                pathname: `/corrections/${correctionId}/edit/genres/edit`,
                query: { genreId: id },
              }}
            >
              <a className='font-bold text-lg'>{genre.name}</a>
            </Link>
            <div className='text-gray-800'>{genre.shortDesc}</div>
          </div>
          <div className='flex justify-between border-t border-gray-200'>
            <div className='flex'>
              <Link
                href={{
                  pathname: `/corrections/${correctionId}/edit/genres/edit`,
                  query: { genreId: id },
                }}
              >
                <a className='border-r border-gray-200 px-2 py-1 uppercase text-xs font-medium text-gray-400 hover:bg-gray-100'>
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
                  <a className='border-r border-gray-200 px-2 py-1 uppercase text-xs font-medium text-gray-400 hover:bg-gray-100'>
                    Add Child {capitalize(childType)}
                  </a>
                </Link>
              ))}
            </div>
            <button
              className='border-l border-gray-200 px-2 py-1 uppercase text-xs font-medium text-gray-400 hover:bg-gray-100 -ml-px'
              onClick={() => handleDelete()}
            >
              Delete
            </button>
          </div>
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
