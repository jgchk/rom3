import Link from 'next/link'
import { FC, useCallback, useState } from 'react'

import useGenreTypeColor from '../../../common/hooks/useGenreTypeColor'
import { GenreApiOutput } from '../../../common/model'
import { ApiGenreInfluence } from '../../../common/services/genres'
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
  const { id: correctionId } = useCorrectionContext()
  const { data: isMyCorrection } = useIsMyCorrectionQuery(correctionId)

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
      {isMyCorrection && (
        <Link
          href={{
            pathname: `/corrections/${correctionId}/genres/edit`,
            query: { genreId: genre.id },
          }}
        >
          <a>Edit</a>
        </Link>
      )}

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
      {genre.children.length > 0 && (
        <div className='space-y-3 bg-stone-100 px-4 py-3 mt-6'>
          <div className='text-stone-600 font-medium'>Children</div>
          <ul className='space-y-3'>
            {genre.children.map((childId) => (
              <li key={childId}>
                <Parent id={childId} />
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

export default ViewView

const Parent: FC<{ id: number }> = ({ id }) => {
  const { id: correctionId } = useCorrectionContext()
  const { data } = useCorrectionGenreQuery(id, correctionId)

  if (!data) return <div>Loading...</div>

  return (
    <div>
      <Link
        href={{
          pathname: `/corrections/${correctionId}/genres/view`,
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
  const { id: correctionId } = useCorrectionContext()
  const { data } = useCorrectionGenreQuery(id, correctionId)

  if (!data) return <div>Loading...</div>

  return (
    <div>
      <Link
        href={{
          pathname: `/corrections/${correctionId}/genres/view`,
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
