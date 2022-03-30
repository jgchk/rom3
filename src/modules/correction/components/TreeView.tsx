import clsx from 'clsx'
import Link from 'next/link'
import { FC, useCallback, useMemo, useState } from 'react'
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
import useIsMyCorrectionQuery from '../hooks/useIsMyCorrectionQuery'

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

  const changedTopLevelIds = useMemo(() => {
    const changedGenres = Object.values(tree).filter((genre) => genre.changes)

    const topLevelIds = new Set()

    const queue = changedGenres.map((genre) => genre.id)
    while (queue.length > 0) {
      const id = queue.pop()
      if (id === undefined) continue

      const genre = tree[id]
      if (genre.parents.length === 0) {
        topLevelIds.add(id)
      }

      queue.push(...genre.parents)
    }

    return topLevelIds
  }, [tree])

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

  const [showUnchanged, setShowUnchanged] = useState(false)

  const renderedGenres = useMemo(
    () =>
      showUnchanged
        ? [...changedTopLevelGenres, ...unchangedTopLevelGenres]
        : changedTopLevelGenres,
    [changedTopLevelGenres, showUnchanged, unchangedTopLevelGenres]
  )

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
      <div className='space-y-4'>
        {isMyCorrection && renderToolbar()}
        <button onClick={() => setShowUnchanged(!showUnchanged)}>
          {showUnchanged ? 'Hide Unchanged' : 'Show Unchanged'}
        </button>
        <ul className='space-y-2'>
          {renderedGenres.map((genre) => (
            <li key={genre.id}>
              <Node id={genre.id} />
            </li>
          ))}
        </ul>
        {isMyCorrection && topLevelGenres.length > 0 && renderToolbar()}
      </div>
    </TreeProvider>
  )
}

const Node: FC<{ id: number }> = ({ id }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data: isMyCorrection } = useIsMyCorrectionQuery(correctionId)

  const tree = useGenreTree()

  const genre = useMemo(() => tree[id], [id, tree])
  console.log({ id, genre })

  const childTypes = useMemo(() => genreChildTypes[genre.type], [genre.type])

  const changedChildIds = useMemo(() => {
    const changedGenres = Object.values(tree).filter((genre) => genre.changes)

    const childIds = new Set<number>()

    const queue = changedGenres.map((genre) => genre.id)
    while (queue.length > 0) {
      const descendantId = queue.pop()
      if (descendantId === undefined) continue

      const genre = tree[descendantId]
      if (genre.parents.includes(id)) {
        childIds.add(descendantId)
      }

      queue.push(...genre.parents)
    }

    return childIds
  }, [id, tree])

  const [changedChildren, unchangedChildren] = useMemo(() => {
    const changed = []
    const unchanged = []

    for (const childId of genre.children) {
      if (changedChildIds.has(childId)) {
        changed.push(tree[childId])
      } else {
        unchanged.push(tree[childId])
      }
    }

    return [changed, unchanged]
  }, [changedChildIds, genre.children, tree])

  const [showUnchanged, setShowUnchanged] = useState(false)

  const renderedChildren = useMemo(
    () =>
      showUnchanged
        ? [...changedChildren, ...unchangedChildren]
        : changedChildren,
    [changedChildren, showUnchanged, unchangedChildren]
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
        return 'bg-green-600 text-white'
      case 'edited':
        return 'bg-blue-600 text-white'
    }
  }, [genre.changes])

  return (
    <div>
      <div className='border border-stone-300 bg-white shadow-sm'>
        <div
          className={clsx(
            'border-b border-stone-200 px-2 py-1 uppercase text-xs font-bold',
            topbarColor
          )}
        >
          {topbarText}
        </div>
        <div className='p-2'>
          <div className='text-xs font-bold text-stone-500'>
            {genre.type}
            {genre.trial && <> (TRIAL)</>}
          </div>
          <div className='text-lg font-medium mt-0.5'>
            <Link
              href={{
                pathname: `/corrections/${correctionId}/genres/${
                  isMyCorrection ? 'edit' : 'view'
                }`,
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
      {renderedChildren.length > 0 && (
        <ul className='mt-2 space-y-2'>
          {renderedChildren.map((genre) => (
            <li className='pl-8' key={genre.id}>
              <Node id={genre.id} />
            </li>
          ))}
        </ul>
      )}
      {!showUnchanged && unchangedChildren.length > 0 && (
        <button onClick={() => setShowUnchanged(true)}>Show Unchanged</button>
      )}
    </div>
  )
}

export default TreeView
