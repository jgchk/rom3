import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import ButtonSecondary from '../../../common/components/ButtonSecondary'
import { useFromQueryParams } from '../../../common/hooks/useFromQueryParam'
import useGenreTypeColor from '../../../common/hooks/useGenreTypeColor'
import useLoggedInQuery from '../../../common/hooks/useLoggedInQuery'
import { useCreateCorrectionMutation } from '../../../common/services/corrections'
import {
  ApiGenreInfluence,
  useGenreQuery,
} from '../../../common/services/genres'
import { TreeProvider, useGenreTree } from '../contexts/TreeContext'
import useGenreTreeQuery, { GenreTree } from '../hooks/useGenreTreeQuery'
import { getDescendantIds } from '../utils/genre'

const TreeView: FC = () => {
  const { data: isLoggedIn } = useLoggedInQuery()
  const { data: treeData } = useGenreTreeQuery()

  const { mutate, isLoading } = useCreateCorrectionMutation()
  const { push: navigate } = useRouter()
  const handleCreate = useCallback(
    () =>
      mutate(null, {
        onSuccess: (res) => {
          void navigate({
            pathname: `/corrections/${res.id}/genres/create`,
            query: { type: 'STYLE' },
          })
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }),
    [mutate, navigate]
  )

  const query = useFromQueryParams()

  return (
    <div>
      {treeData ? <Tree tree={treeData} /> : <div>Loading...</div>}

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
          className='p-4 pb-1'
          childIds={genre.children}
          influences={genre.influences}
        />
      )}
    </div>
  )
}

const Children: FC<{
  childIds: number[]
  influences: ApiGenreInfluence[]
  className?: string
}> = ({ childIds, influences, className }) => (
  <ul className={clsx('space-y-4', className)}>
    {childIds.map((id) => (
      <Child key={id} id={id} />
    ))}
    {influences.map((inf) => (
      <Influence key={`${inf.id}_${inf.influenceType ?? ''}`} influence={inf} />
    ))}
  </ul>
)

const Child: FC<{ id: number }> = ({ id }) => {
  const { data } = useGenreQuery(id)

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <li className='pl-6 border-l-2 border-primary-600'>
      <div className='py-2'>
        <div className='text-xs font-bold text-stone-500'>
          {data.type}
          {data.trial && <> (TRIAL)</>}
        </div>

        <Link href={`/genres/${data.id}`}>
          <a className='text-primary-600 font-semibold hover:underline'>
            {data.name}
          </a>
        </Link>

        <p className='text-sm text-stone-600'>{data.shortDesc}</p>
      </div>

      <Children
        className='mt-4'
        childIds={data.children}
        influences={data.influences}
      />
    </li>
  )
}

const Influence: FC<{ influence: ApiGenreInfluence }> = ({ influence }) => {
  const { data } = useGenreQuery(influence.id)

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <li className='pl-6 border-l-2 border-primary-600'>
      <div className='py-2'>
        <div className='text-xs font-bold text-stone-500'>
          {data.type}
          {data.trial && <> (TRIAL)</>}
          &nbsp;&nbsp;{'•'}&nbsp;&nbsp;
          {influence.influenceType ?? ''} INFLUENCE
        </div>

        <Link href={`/genres/${data.id}`}>
          <a className='text-primary-600 font-semibold hover:underline'>
            {data.name}
          </a>
        </Link>

        <p className='text-sm text-stone-500'>{data.shortDesc}</p>
      </div>

      <Children
        className='mt-4'
        childIds={data.children}
        influences={data.influences}
      />
    </li>
  )
}

export default TreeView
