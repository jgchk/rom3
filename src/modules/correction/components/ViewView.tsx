import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

import ButtonSecondary from '../../../common/components/ButtonSecondary'
import useGenreTypeColor from '../../../common/hooks/useGenreTypeColor'
import { GenreApiOutput } from '../../../common/model'
import { useCorrectionContext } from '../contexts/CorrectionContext'
import useCorrectionGenreQuery from '../hooks/useCorrectionGenreQuery'
import useIsMyCorrectionQuery from '../hooks/useIsMyCorrectionQuery'

const ViewView: FC<{ genreId: number }> = ({ genreId }) => {
  const { id: correctionId } = useCorrectionContext()

  const { data } = useCorrectionGenreQuery(genreId, correctionId)

  if (!data) {
    return <div>Loading...</div>
  }

  return <Loaded genre={data} />
}

const Loaded: FC<{
  genre: GenreApiOutput
}> = ({ genre }) => {
  const [expanded, setExpanded] = useState(false)

  const { id: correctionId } = useCorrectionContext()
  const { data: isMyCorrection } = useIsMyCorrectionQuery(correctionId)

  const color = useGenreTypeColor(genre.type)

  const { asPath } = useRouter()

  return (
    <div className='space-y-4'>
      <Breadcrumbs genre={genre} />

      <div className='bg-white border border-stone-300 shadow-sm p-6'>
        <div className='text-xs font-bold'>
          <span className={color}>{genre.type}</span>
          {genre.trial && (
            <>
              {' '}
              <span className='text-stone-500'>(TRIAL)</span>
            </>
          )}
        </div>
        <div className='text-xl font-medium mt-0.5'>{genre.name}</div>
        {genre.alternateNames.length > 0 && (
          <div className='text-stone-600 font-medium text-sm mt-1'>
            AKA: {genre.alternateNames.join(', ')}
          </div>
        )}
        {genre.locations.length > 0 && (
          <div className='text-stone-600 font-medium text-sm mt-1'>
            Locations:{' '}
            {genre.locations.map((loc) =>
              [loc.city, loc.country, loc.region]
                .filter((s) => s.length > 0)
                .join(', ')
            )}
          </div>
        )}
        {genre.cultures.length > 0 && (
          <div className='text-stone-600 font-medium text-sm mt-1'>
            Cultures: {genre.cultures.join(', ')}
          </div>
        )}
        <Description
          genre={genre}
          expanded={expanded}
          onExpandChange={(expanded) => setExpanded(expanded)}
        />
      </div>

      <Hierarchy genre={genre} />

      {isMyCorrection && (
        <div>
          <Link
            href={{
              pathname: `/corrections/${correctionId}/genres/edit`,
              query: { genreId: genre.id, from: asPath },
            }}
          >
            <a>
              <ButtonSecondary>Edit</ButtonSecondary>
            </a>
          </Link>
        </div>
      )}
    </div>
  )
}

export default ViewView

const Description: FC<{
  genre: GenreApiOutput
  expanded: boolean
  onExpandChange: (expanded: boolean) => void
}> = ({ genre, expanded, onExpandChange }) => {
  if (genre.shortDesc && genre.longDesc) {
    return (
      <div className='mt-3'>
        {/* TODO: render markdown for long desc */}
        <div>{expanded ? genre.longDesc : genre.shortDesc}</div>
        <button
          className='text-sm font-semibold text-stone-700 hover:text-primary-600'
          onClick={() => onExpandChange(!expanded)}
        >
          {expanded ? 'Show Short Description' : 'Show Long Description'}
        </button>
      </div>
    )
  }

  if (genre.shortDesc) {
    return <div className='mt-3'>{genre.shortDesc}</div>
  }

  if (genre.longDesc) {
    return (
      <div className='mt-3'>
        {/* TODO: render markdown for long desc */}
        {expanded && <div>{genre.longDesc}</div>}
        <button
          className='text-sm font-semibold text-stone-700 hover:text-primary-600'
          onClick={() => onExpandChange(!expanded)}
        >
          {expanded ? 'Show Short Description' : 'Show Long Description'}
        </button>
      </div>
    )
  }

  return null
}

const Breadcrumbs: FC<{ genre: GenreApiOutput }> = ({ genre }) => {
  const { id: correctionId } = useCorrectionContext()

  return (
    <ol className='flex items-center text-sm text-stone-500'>
      <li>
        <Link href={`/corrections/${correctionId}/tree`}>
          <a className='font-medium group flex items-center px-2 py-1'>
            <HiChevronLeft className='mr-1' />
            <span className='group-hover:underline'>All Genres</span>
          </a>
        </Link>
      </li>
      {genre.parents.length > 0 && <HiChevronRight />}
      {genre.parents.map((id, i) => (
        <li key={id}>
          {i !== 0 && '|'}
          <Breadcrumb id={id} />
        </li>
      ))}
      <HiChevronRight />
      <div className='font-semibold px-2 py-1'>{genre.name}</div>
    </ol>
  )
}

const Breadcrumb: FC<{ id: number }> = ({ id }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data } = useCorrectionGenreQuery(id, correctionId)

  return (
    <Link
      href={{
        pathname: `/corrections/${correctionId}/genres/view`,
        query: { genreId: id },
      }}
    >
      <a className='text-sm text-stone-500 font-medium inline-flex items-center px-2 py-1 hover:underline'>
        {data ? data.name : 'Loading...'}
      </a>
    </Link>
  )
}

const Hierarchy: FC<{ genre: GenreApiOutput }> = ({ genre }) => (
  <div className='bg-white shadow-sm border border-stone-300'>
    <div className='px-2 py-1 text-stone-600 font-medium border-b border-stone-200'>
      Hierarchy
    </div>
    <ul className='px-6 pt-5 pb-3 space-y-4'>
      {genre.parents.map((id) => (
        <li key={id}>
          <Parent id={id} />
        </li>
      ))}

      <li>
        <div className='text-stone-600 font-medium text-lg'>{genre.name}</div>

        <Children childIds={genre.children} />
      </li>
    </ul>
  </div>
)

const Parent: FC<{ id: number }> = ({ id }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data } = useCorrectionGenreQuery(id, correctionId)

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Link
        href={{
          pathname: `/corrections/${correctionId}/genres/view`,
          query: { genreId: id },
        }}
      >
        <a className='text-primary-600 font-semibold hover:underline'>
          {data.name}
        </a>
      </Link>

      <div className='text-sm text-stone-600'>{data.shortDesc}</div>
    </div>
  )
}

const Child: FC<{ id: number }> = ({ id }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data } = useCorrectionGenreQuery(id, correctionId)

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className='py-2'>
        <Link
          href={{
            pathname: `/corrections/${correctionId}/genres/view`,
            query: { genreId: id },
          }}
        >
          <a className='text-primary-600 font-semibold hover:underline'>
            {data.name}
          </a>
        </Link>

        <div className='text-sm text-stone-600'>{data.shortDesc}</div>
      </div>

      <Children childIds={data.children} />
    </div>
  )
}

const Children: FC<{ childIds: number[] }> = ({ childIds }) => (
  <ul className='mt-4 space-y-4'>
    {childIds.map((id) => (
      <li className='pl-6 border-l-2 border-primary-600' key={id}>
        <Child id={id} />
      </li>
    ))}
  </ul>
)
