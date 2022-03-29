import Link from 'next/link'
import { FC, useCallback, useState } from 'react'

import useGenreTypeColor from '../../../common/hooks/useGenreTypeColor'
import { GenreApiOutput } from '../../../common/model'
import {
  ApiGenreInfluence,
  useGenreQuery,
} from '../../../common/services/genres'

const Genre: FC<{ id: number }> = ({ id }) => {
  const { data } = useGenreQuery(id)

  if (!data) {
    return <div>Loading...</div>
  }

  return <Loaded genre={data} />
}

const Loaded: FC<{
  genre: GenreApiOutput
}> = ({ genre }) => {
  const [expanded, setExpanded] = useState(false)

  const color = useGenreTypeColor(genre.type)

  const renderDescription = useCallback(() => {
    if (genre.shortDesc && genre.longDesc) {
      return (
        <div className='mt-3'>
          {/* TODO: render markdown for long desc */}
          <div>{expanded ? genre.longDesc : genre.shortDesc}</div>
          <button
            className='text-sm font-semibold text-stone-700 hover:text-primary-600'
            onClick={() => setExpanded(!expanded)}
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
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show Short Description' : 'Show Long Description'}
          </button>
        </div>
      )
    }

    return null
  }, [expanded, genre.longDesc, genre.shortDesc])

  return (
    <div>
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
      {renderDescription()}
      {genre.parents.length > 0 && (
        <div className='space-y-3 bg-stone-100 px-4 py-3 mt-6'>
          <div className='text-stone-600 font-medium'>Parents</div>
          <ul className='space-y-3'>
            {genre.parents.map((parentId) => (
              <li key={parentId}>
                <Parent id={parentId} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {genre.influencedBy.length > 0 && (
        <div className='space-y-3 bg-stone-100 px-4 py-3 mt-6'>
          <div className='text-stone-600 font-medium'>Influences</div>
          <ul className='space-y-3'>
            {genre.influencedBy.map((inf) => (
              <li key={inf.id}>
                <Influence {...inf} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Genre

const Parent: FC<{ id: number }> = ({ id }) => {
  const { data } = useGenreQuery(id)

  if (!data) return <div>Loading...</div>

  return (
    <div>
      <Link
        href={{
          pathname: `/genres/${id}`,
          query: { genreId: id },
        }}
      >
        <a className='font-semibold text-primary-600 hover:underline'>
          {data.name}
        </a>
      </Link>
      {data.shortDesc && (
        <div className='text-sm font-medium text-stone-700'>
          {data.shortDesc}
        </div>
      )}
    </div>
  )
}

const Influence: FC<ApiGenreInfluence> = ({ id, influenceType }) => {
  const { data } = useGenreQuery(id)

  if (!data) return <div>Loading...</div>

  return (
    <div>
      <Link
        href={{
          pathname: `/genres/${id}`,
          query: { genreId: id },
        }}
      >
        <a className='font-semibold text-primary-600 hover:underline'>
          {data.name}
        </a>
      </Link>
      {influenceType && (
        <div className='text-sm font-semibold text-stone-500'>
          {influenceType}
        </div>
      )}
      {data.shortDesc && (
        <div className='text-sm font-medium text-stone-700'>
          {data.shortDesc}
        </div>
      )}
    </div>
  )
}
