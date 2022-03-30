import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import ButtonSecondary from '../../../common/components/ButtonSecondary'
import useGenreTypeColor from '../../../common/hooks/useGenreTypeColor'
import useLoggedInQuery from '../../../common/hooks/useLoggedInQuery'
import { GenreApiOutput } from '../../../common/model'
import { useCreateCorrectionMutation } from '../../../common/services/corrections'
import { useGenreQuery } from '../../../common/services/genres'
import { TreeProvider, useGenreTree } from '../contexts/TreeContext'
import useGenreTreeQuery, { GenreTree } from '../hooks/useGenreTreeQuery'
import { getDescendantIds } from '../utils/genre'

const TreeView: FC<{ parentId?: number }> = ({ parentId }) => {
  const { data: isLoggedIn } = useLoggedInQuery()

  const { mutate, isLoading } = useCreateCorrectionMutation()
  const { push: navigate } = useRouter()
  const handleCreate = useCallback(
    () =>
      mutate(
        {},
        {
          onSuccess: (res) => {
            void navigate(`/corrections/${res.id}/genres/create`)
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [mutate, navigate]
  )

  return (
    <div>
      {parentId !== undefined ? (
        <HasParent parentId={parentId} />
      ) : (
        <NoParent />
      )}

      {isLoggedIn && (
        <ButtonSecondary
          className='mt-4'
          onClick={() => handleCreate()}
          disabled={isLoading}
        >
          Add New Genre
        </ButtonSecondary>
      )}
    </div>
  )
}

const HasParent: FC<{ parentId: number }> = ({ parentId }) => {
  const { data: treeData } = useGenreTreeQuery()
  const { data: genreData } = useGenreQuery(parentId)

  if (treeData) {
    return <Tree tree={treeData} parentGenre={genreData} />
  }

  return <div>Loading...</div>
}

const NoParent: FC = () => {
  const { data: treeData } = useGenreTreeQuery()

  if (treeData) {
    return <Tree tree={treeData} />
  }

  return <div>Loading...</div>
}

const Tree: FC<{ tree: GenreTree; parentGenre?: GenreApiOutput }> = ({
  tree,
  parentGenre,
}) => {
  const topLevelGenres = useMemo(
    () =>
      (parentGenre
        ? parentGenre.children.map((id) => tree[id])
        : Object.values(tree).filter((genre) => genre.parents.length === 0)
      ).sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      ),
    [parentGenre, tree]
  )

  return (
    <TreeProvider tree={tree}>
      <div className='space-y-4'>
        {topLevelGenres.length > 0 && (
          <ul className='space-y-4'>
            {topLevelGenres.map((genre) => (
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

const Node: FC<{ id: number }> = ({ id }) => {
  const tree = useGenreTree()

  const genre = useMemo(() => tree[id], [id, tree])

  const color = useGenreTypeColor(genre.type)

  const descendantIds = useMemo(() => getDescendantIds(id, tree), [id, tree])
  const [expanded, setExpanded] = useState(false)

  return (
    <div className='border border-stone-300 bg-white shadow-sm'>
      <div className='p-5'>
        <div className='text-xs font-bold'>
          <span className={color}>{genre.type}</span>
          {genre.trial && (
            <>
              {' '}
              <span className='text-stone-500'>(TRIAL)</span>
            </>
          )}
        </div>
        <div className='text-lg font-medium mt-0.5'>
          <Link href={`/genres/${id}`}>
            <a className='hover:underline'>{genre.name}</a>
          </Link>
        </div>
        <div className='text-sm text-stone-700 mt-1'>{genre.shortDesc}</div>
      </div>
      <button
        className={clsx(
          'w-full text-left border-t border-stone-200 px-2 py-1 uppercase text-xs font-medium text-stone-400 hover:bg-stone-100',
          expanded && 'border-b'
        )}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Hide' : 'Show'} {descendantIds.length} subgenres
      </button>
      {expanded && <Children className='p-4 pb-1' childIds={genre.children} />}
    </div>
  )
}

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

        <div className='text-sm text-stone-600'>{data.shortDesc}</div>
      </div>

      <Children className='mt-4' childIds={data.children} />
    </div>
  )
}

const Children: FC<{ childIds: number[]; className?: string }> = ({
  childIds,
  className,
}) => (
  <ul className={clsx('space-y-4', className)}>
    {childIds.map((id) => (
      <li className='pl-6 border-l-2 border-primary-600' key={id}>
        <Child id={id} />
      </li>
    ))}
  </ul>
)

export default TreeView
