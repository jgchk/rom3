import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import ButtonSecondary from '../../../common/components/ButtonSecondary'
import Loader from '../../../common/components/Loader'
import { useFromQueryParams } from '../../../common/hooks/useFromQueryParam'
import useGenreTypeColor from '../../../common/hooks/useGenreTypeColor'
import useLoggedInQuery from '../../../common/hooks/useLoggedInQuery'
import { useCreateCorrectionMutation } from '../../../common/services/corrections'
import { TreeProvider, useGenreTree } from '../contexts/TreeContext'
import useGenreTreeQuery, { GenreTree } from '../hooks/useGenreTreeQuery'
import { getDescendantIds } from '../utils/genre'
import { Children } from './Hierarchy'

const TreeView: FC = () => {
  const { data: isLoggedIn } = useLoggedInQuery()
  const { data: treeData } = useGenreTreeQuery()

  const { mutate, isLoading } = useCreateCorrectionMutation()
  const { push: navigate, asPath } = useRouter()
  const handleCreate = useCallback(
    () =>
      mutate(null, {
        onSuccess: (res) => {
          void navigate({
            pathname: `/corrections/${res.id}/genres/create`,
            query: { type: 'STYLE', deleteOnCancel: true, from: asPath },
          })
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }),
    [asPath, mutate, navigate]
  )

  const query = useFromQueryParams()

  return (
    <div>
      {treeData ? (
        <Tree tree={treeData} />
      ) : (
        <Loader size={32} className='p-6 text-stone-600' />
      )}

      {isLoggedIn ? (
        <ButtonSecondary
          className='mt-4'
          onClick={() => handleCreate()}
          disabled={isLoading}
        >
          Add New Genre
        </ButtonSecondary>
      ) : (
        <div className='text-stone-700 mt-4'>
          <Link href={{ pathname: '/register', query }}>
            <a className='text-primary-600 font-bold hover:underline'>
              Register
            </a>
          </Link>{' '}
          to add a genre
        </div>
      )}
    </div>
  )
}

const Tree: FC<{ tree: GenreTree }> = ({ tree }) => {
  const topLevelGenres = useMemo(
    () =>
      Object.values(tree)
        .filter(
          (genre) =>
            genre.parents.length === 0 && genre.influencedBy.length === 0
        )
        .sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        ),
    [tree]
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
        <p className='text-sm text-stone-700 mt-1'>{genre.shortDesc}</p>
      </div>

      {descendantIds.length > 0 && (
        <button
          className={clsx(
            'w-full border-t border-stone-200 px-2 py-1 uppercase text-xs font-medium text-stone-400 hover:bg-stone-100',
            expanded && 'border-b'
          )}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide' : 'Show'} {descendantIds.length} subgenre
          {descendantIds.length !== 1 && 's'}
        </button>
      )}

      {expanded && (
        <Children
          className='p-4'
          childIds={genre.children}
          influences={genre.influences}
        />
      )}
    </div>
  )
}

export default TreeView
