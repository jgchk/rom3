import clsx from 'clsx'
import Link from 'next/link'
import { FC, useMemo } from 'react'

import Loader from '../../../common/components/Loader'
import { GenreApiOutput } from '../../../common/model'
import { ApiGenreInfluence } from '../../../common/services/genres'
import { TreeProvider, useGenreTree } from '../contexts/TreeContext'
import useGenreTreeQuery from '../hooks/useGenreTreeQuery'

const Hierarchy: FC<{ genre: GenreApiOutput }> = ({ genre }) => {
  const { data: tree } = useGenreTreeQuery()

  return (
    <div className='bg-white shadow-sm border border-stone-300'>
      <div className='px-2 py-1 text-stone-600 font-medium border-b border-stone-200'>
        Hierarchy
      </div>

      {tree ? (
        <TreeProvider tree={tree}>
          <ul className='px-6 pt-5 pb-3 space-y-4'>
            {genre.parents.map((id) => (
              <li key={id}>
                <Parent id={id} />
              </li>
            ))}
            {genre.influencedBy.map((inf) => (
              <li key={`${inf.id}_${inf.influenceType ?? ''}`}>
                <Influencer influence={inf} />
              </li>
            ))}

            <li>
              <div className='text-stone-600 font-medium text-lg'>
                {genre.name}
              </div>

              <Children
                className='mt-4 mb-3'
                childIds={genre.children}
                influences={genre.influences}
              />
            </li>
          </ul>
        </TreeProvider>
      ) : (
        <Loader className='p-6 text-stone-600' size={24} />
      )}
    </div>
  )
}

const Parent: FC<{ id: number }> = ({ id }) => {
  const genres = useGenreTree()
  const genre = useMemo(() => genres[id], [genres, id])

  return (
    <div>
      <div className='text-xs font-bold text-stone-500'>
        {genre.type}
        {genre.trial && <> (TRIAL)</>}
      </div>

      <Link href={`/genres/${genre.id}`}>
        <a className='text-primary-600 font-semibold hover:underline'>
          {genre.name}
        </a>
      </Link>

      <p className='text-sm text-stone-600'>{genre.shortDesc}</p>
    </div>
  )
}

const Influencer: FC<{ influence: ApiGenreInfluence }> = ({ influence }) => {
  const genres = useGenreTree()
  const genre = useMemo(() => genres[influence.id], [genres, influence.id])

  return (
    <div>
      <div className='text-xs font-bold text-stone-500'>
        {genre.type}
        {genre.trial && <> (TRIAL)</>}
        &nbsp;&nbsp;{'•'}&nbsp;&nbsp;
        {influence.influenceType ?? ''} INFLUENCE
      </div>

      <Link href={`/genres/${genre.id}`}>
        <a className='text-primary-600 font-semibold hover:underline'>
          {genre.name}
        </a>
      </Link>

      <p className='text-sm text-stone-600'>{genre.shortDesc}</p>
    </div>
  )
}

export const Children: FC<{
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
  const genres = useGenreTree()
  const genre = useMemo(() => genres[id], [genres, id])

  return (
    <li className='pl-6 border-l-2 border-primary-600'>
      <div className='py-2'>
        <div className='text-xs font-bold text-stone-500'>
          {genre.type}
          {genre.trial && <> (TRIAL)</>}
        </div>

        <Link href={`/genres/${genre.id}`}>
          <a className='text-primary-600 font-semibold hover:underline'>
            {genre.name}
          </a>
        </Link>

        <p className='text-sm text-stone-600'>{genre.shortDesc}</p>
      </div>

      <Children childIds={genre.children} influences={genre.influences} />
    </li>
  )
}

const Influence: FC<{ influence: ApiGenreInfluence }> = ({ influence }) => {
  const genres = useGenreTree()
  const genre = useMemo(() => genres[influence.id], [genres, influence.id])

  return (
    <li className='pl-6 border-l-2 border-primary-600'>
      <div className='py-2'>
        <div className='text-xs font-bold text-stone-500'>
          {genre.type}
          {genre.trial && <> (TRIAL)</>}
          &nbsp;&nbsp;{'•'}&nbsp;&nbsp;
          {influence.influenceType ?? ''} INFLUENCE
        </div>

        <Link href={`/genres/${genre.id}`}>
          <a className='text-primary-600 font-semibold hover:underline'>
            {genre.name}
          </a>
        </Link>

        <p className='text-sm text-stone-500'>{genre.shortDesc}</p>
      </div>

      <Children childIds={genre.children} influences={genre.influences} />
    </li>
  )
}

export default Hierarchy
