import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useMemo, useState } from 'react'

import { ButtonSecondaryLink } from '../../../common/components/ButtonSecondary'
import Tooltip from '../../../common/components/Tooltip'
import { ApiGenreInfluence } from '../../../common/services/genres'
import { useCorrectionContext } from '../contexts/CorrectionContext'
import { TreeProvider, useGenreTree } from '../contexts/TreeContext'
import useCorrectionGenreQuery, {
  ChangeType,
} from '../hooks/useCorrectionGenreQuery'
import useCorrectionGenreTreeQuery, {
  GenreTree,
} from '../hooks/useCorrectionGenreTreeQuery'
import useIsMyCorrectionQuery from '../hooks/useIsMyCorrectionQuery'
import {
  getChangeBackgroundColor,
  getChangeBorderColor,
  getChangeTextColor,
  getTopbarColor,
  getTopbarText,
} from '../utils/display'
import { getDescendantChanges, getDescendantIds } from '../utils/genre'

const TreeView: FC = () => {
  const { id: correctionId } = useCorrectionContext()
  const { data: isMyCorrection } = useIsMyCorrectionQuery(correctionId)
  const { data: treeData } = useCorrectionGenreTreeQuery(correctionId)

  const { asPath } = useRouter()

  return (
    <div>
      {treeData ? <Tree tree={treeData} /> : <div>Loading...</div>}

      {isMyCorrection && (
        <ButtonSecondaryLink
          className='mt-4'
          href={{
            pathname: `/corrections/${correctionId}/genres/create`,
            query: {
              type: 'STYLE',
              from: asPath,
            },
          }}
        >
          Add New Genre
        </ButtonSecondaryLink>
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

  const changedTopLevelIds = useMemo(
    () =>
      new Set(
        topLevelGenres
          .filter(
            (genre) =>
              genre.changes || getDescendantChanges(genre.id, tree).size > 0
          )
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

  return (
    <TreeProvider tree={tree}>
      <div className='space-y-4'>
        {changedTopLevelGenres.length > 0 && (
          <ul className='space-y-4'>
            {changedTopLevelGenres.map((genre) => (
              <li key={genre.id}>
                <Node id={genre.id} />
              </li>
            ))}
          </ul>
        )}
        {unchangedTopLevelGenres.length > 0 && (
          <ul className='space-y-4'>
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

const Node: FC<{ id: number }> = ({ id }) => {
  const { id: correctionId } = useCorrectionContext()

  const tree = useGenreTree()

  const genre = useMemo(() => tree[id], [id, tree])

  const descendantIds = useMemo(() => getDescendantIds(id, tree), [id, tree])
  const [expanded, setExpanded] = useState(false)

  const descendantChanges = useMemo(
    () => getDescendantChanges(id, tree),
    [id, tree]
  )

  const topbarText: string = useMemo(
    () => getTopbarText(genre.changes),
    [genre.changes]
  )

  const topbarColor: string = useMemo(
    () => getTopbarColor(genre.changes),
    [genre.changes]
  )

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

      <div className='p-5'>
        <div className='text-xs font-bold text-stone-500'>
          {genre.type}
          {genre.trial && <> (TRIAL)</>}
        </div>
        <div className='text-lg font-medium mt-0.5'>
          <Link href={`/corrections/${correctionId}/genres/${id}`}>
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

const Changes: FC<{ changes: Set<ChangeType> }> = ({ changes }) => {
  const sorted = useMemo(() => [...changes].sort(), [changes])

  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  return (
    <>
      <div className='flex items-center space-x-1 px-2' ref={setRef}>
        {sorted.map((type) => (
          <div
            className={clsx(
              'w-2 h-2 rounded-full ring-1 ring-white',
              getChangeBackgroundColor(type)
            )}
            key={type}
          />
        ))}
      </div>

      <Tooltip referenceElement={ref}>Has changes in subtree</Tooltip>
    </>
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
  const { id: correctionId } = useCorrectionContext()
  const { data } = useCorrectionGenreQuery(id, correctionId)

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <li className={clsx('pl-6 border-l-2', getChangeBorderColor(data.changes))}>
      <div className='py-2'>
        <div className='text-xs font-bold text-stone-500'>
          {data.type}
          {data.trial && <> (TRIAL)</>}
        </div>

        <Link href={`/corrections/${correctionId}/genres/${id}`}>
          <a
            className={clsx(
              'font-semibold hover:underline',
              getChangeTextColor(data.changes)
            )}
          >
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

const Influence: FC<{ influence: ApiGenreInfluence }> = ({ influence }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data } = useCorrectionGenreQuery(influence.id, correctionId)

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <li className={clsx('pl-6 border-l-2', getChangeBorderColor(data.changes))}>
      <div className='py-2'>
        <div className='text-xs font-bold text-stone-500'>
          {data.type}
          {data.trial && <> (TRIAL)</>}
          &nbsp;&nbsp;{'•'}&nbsp;&nbsp;
          {influence.influenceType ?? ''} INFLUENCE
        </div>

        <Link href={`/corrections/${correctionId}/genres/${influence.id}`}>
          <a
            className={clsx(
              'font-semibold hover:underline',
              getChangeTextColor(data.changes)
            )}
          >
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
