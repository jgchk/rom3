import clsx from 'clsx'
import Link from 'next/link'
import { FC, useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import Tooltip from '../../../common/components/Tooltip'
import { genreTypes } from '../../../common/model'
import { genreChildTypes } from '../../../common/model/parents'
import { useDeleteCorrectionGenreMutation } from '../../../common/services/corrections'
import { capitalize } from '../../../common/utils/string'
import { useCorrectionContext } from '../contexts/CorrectionContext'
import { TreeProvider, useGenreTree } from '../contexts/TreeContext'
import { ChangeType } from '../hooks/useCorrectionGenreQuery'
import useCorrectionGenreTreeQuery, {
  GenreTree,
} from '../hooks/useCorrectionGenreTreeQuery'
import useIsMyCorrectionQuery from '../hooks/useIsMyCorrectionQuery'
import { getDescendantChanges } from '../utils/genre'

const TreeView: FC = () => {
  const { id: correctionId } = useCorrectionContext()
  const { data: treeData } = useCorrectionGenreTreeQuery(correctionId)

  if (treeData) {
    return <Tree tree={treeData} />
  }

  return <div>Loading...</div>
}

const Tree: FC<{ tree: GenreTree }> = ({ tree }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data: isMyCorrection } = useIsMyCorrectionQuery(correctionId)

  const topLevelGenres = useMemo(
    () => Object.values(tree).filter((genre) => genre.parents.length === 0),
    [tree]
  )

  const changedTopLevelIds = useMemo(
    () =>
      new Set(
        topLevelGenres
          .filter((genre) => getDescendantChanges(genre.id, tree).size > 0)
          .map((genre) => genre.id)
      ),
    [topLevelGenres, tree]
  )

  const [changedTopLevelGenres, unchangedTopLevelGenres] = useMemo(() => {
    const changed = []
    const unchanged = []

    for (const genre of topLevelGenres) {
      if (changedTopLevelIds.has(genre.id)) {
        changed.push(genre)
      } else {
        unchanged.push(genre)
      }
    }

    return [changed, unchanged]
  }, [changedTopLevelIds, topLevelGenres])

  const renderToolbar = useCallback(
    () => (
      <div className='flex border border-stone-300 bg-white shadow-sm w-fit'>
        {genreTypes.map((genreType) => (
          <Link
            key={genreType}
            href={{
              pathname: `/corrections/${correctionId}/genres/create`,
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
      <div>
        {isMyCorrection && renderToolbar()}
        {changedTopLevelGenres.length > 0 && (
          <ul className='space-y-4 mt-8'>
            {changedTopLevelGenres.map((genre) => (
              <li key={genre.id}>
                <Node id={genre.id} />
              </li>
            ))}
          </ul>
        )}
        {unchangedTopLevelGenres.length > 0 && (
          <ul className='space-y-4 mt-4'>
            {unchangedTopLevelGenres.map((genre) => (
              <li key={genre.id}>
                <Node id={genre.id} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </TreeProvider>
  )
}

const getChangeColor = (type: ChangeType): string => {
  switch (type) {
    case 'created':
      return 'bg-green-600'
    case 'edited':
      return 'bg-blue-600'
  }
}

const Node: FC<{ id: number }> = ({ id }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data: isMyCorrection } = useIsMyCorrectionQuery(correctionId)

  const tree = useGenreTree()

  const genre = useMemo(() => tree[id], [id, tree])
  const childTypes = useMemo(() => genreChildTypes[genre.type], [genre.type])

  const descendantChanges = useMemo(
    () => getDescendantChanges(id, tree),
    [id, tree]
  )

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

  const topbarText: string = useMemo(() => {
    switch (genre.changes) {
      case undefined:
        return 'Unchanged'
      case 'created':
        return 'Created'
      case 'edited':
        return 'Edited'
    }
  }, [genre.changes])

  const topbarColor: string = useMemo(() => {
    switch (genre.changes) {
      case undefined:
        return 'bg-stone-200 text-stone-400'
      case 'created':
      case 'edited':
        return clsx(getChangeColor(genre.changes), 'text-white')
    }
  }, [genre.changes])

  return (
    <div className='border border-stone-300 bg-white shadow-sm'>
      <div
        className={clsx(
          'border-b border-stone-200 px-2 py-1 uppercase text-xs font-bold flex items-stretch',
          topbarColor
        )}
      >
        <div>{topbarText}</div>
        {descendantChanges.size > 0 && <Changes changes={descendantChanges} />}
      </div>
      <div className='p-2'>
        <div className='text-xs font-bold text-stone-500'>
          {genre.type}
          {genre.trial && <> (TRIAL)</>}
        </div>
        <div className='text-lg font-medium mt-0.5'>
          <Link
            href={{
              pathname: `/corrections/${correctionId}/genres/view`,
              query: { genreId: id },
            }}
          >
            <a className='hover:underline'>{genre.name}</a>
          </Link>
        </div>
        <div className='text-sm text-stone-700 mt-1'>{genre.shortDesc}</div>
      </div>
      {isMyCorrection && (
        <div className='flex justify-between border-t border-stone-200'>
          <div className='flex'>
            <Link
              href={{
                pathname: `/corrections/${correctionId}/genres/edit`,
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
                  pathname: `/corrections/${correctionId}/genres/create`,
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
      )}
    </div>
  )
}

const Changes: FC<{ changes: Set<ChangeType> }> = ({ changes }) => {
  const sorted = useMemo(() => [...changes].sort(), [changes])

  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  return (
    <>
      <div className='flex items-center space-x-1 px-2' ref={setRef}>
        {sorted.map((type) => (
          <div
            className={clsx(
              'w-1.5 h-1.5 rounded-full ring-1 ring-stone-200',
              getChangeColor(type)
            )}
            key={type}
          />
        ))}
      </div>

      <Tooltip referenceElement={ref}>Has changes in subtree</Tooltip>
    </>
  )
}

export default TreeView
