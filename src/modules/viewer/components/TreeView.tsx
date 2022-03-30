import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, MouseEvent, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { HiChevronDown, HiChevronRight } from 'react-icons/hi'

import ButtonSecondary from '../../../common/components/ButtonSecondary'
import useGenreTypeColor from '../../../common/hooks/useGenreTypeColor'
import { GenreApiOutput } from '../../../common/model'
import { useCreateCorrectionMutation } from '../../../common/services/corrections'
import { useGenreQuery, useGenresQuery } from '../../../common/services/genres'

const TreeView: FC = () => {
  const { data } = useGenresQuery({ filters: { topLevel: true } })

  const { mutate, isLoading } = useCreateCorrectionMutation()
  const { push: navigate } = useRouter()
  const handleAddNewGenre = useCallback(
    () =>
      mutate(
        {},
        {
          onSuccess: (res) => {
            void navigate({
              pathname: `/corrections/${res.id}/genres/create`,
              query: { type: 'STYLE' },
            })
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
      <ButtonSecondary
        className='mb-6'
        onClick={() => handleAddNewGenre()}
        disabled={isLoading}
      >
        Add New Genre
      </ButtonSecondary>
      {data ? (
        <ul className='space-y-6'>
          {data.map((genre) => (
            <li key={genre.id}>
              <Node id={genre.id} />
            </li>
          ))}
        </ul>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

const Node: FC<{ id: number; expanded?: ExpandState }> = ({ id, expanded }) => {
  const { data } = useGenreQuery(id)

  if (!data) {
    return <div>Loading...</div>
  }

  return <LoadedNode genre={data} expanded={expanded} />
}

type ExpandState = false | 'single' | 'all'

const LoadedNode: FC<{ genre: GenreApiOutput; expanded?: ExpandState }> = ({
  genre,
  expanded: passedExpanded,
}) => {
  const [expanded, setExpanded] = useState<ExpandState>(false)
  useEffect(() => {
    if (passedExpanded !== undefined) {
      setExpanded(passedExpanded)
    }
  }, [passedExpanded])

  const color = useGenreTypeColor(genre.type)

  const handleExpand = useCallback(
    (e: MouseEvent) => {
      if (expanded) {
        setExpanded(false)
      } else {
        if (e.altKey) {
          setExpanded('all')
        } else {
          setExpanded('single')
        }
      }
    },
    [expanded]
  )

  const { mutate, isLoading } = useCreateCorrectionMutation()
  const { push: navigate, asPath } = useRouter()
  const handleEditGenre = useCallback(
    () =>
      mutate(
        {},
        {
          onSuccess: (res) => {
            void navigate({
              pathname: `/corrections/${res.id}/genres/edit`,
              query: { genreId: genre.id, from: asPath },
            })
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [asPath, genre.id, mutate, navigate]
  )

  return (
    <div>
      <div className='flex'>
        <button
          className={clsx(
            'p-2 text-stone-600 hover:text-primary-600',
            genre.children.length === 0 && 'invisible'
          )}
          onClick={(e) => handleExpand(e)}
        >
          {expanded ? <HiChevronDown /> : <HiChevronRight />}
        </button>
        <div className='flex-1 border border-stone-300 bg-white shadow-sm'>
          <div className='p-2'>
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
              <Link href={`/genres/${genre.id}`}>
                <a className='hover:underline'>{genre.name}</a>
              </Link>
            </div>
            <div className='text-sm text-stone-700 mt-1'>{genre.shortDesc}</div>
          </div>
          <div className='flex justify-between border-t border-stone-200'>
            <button
              className='border-r border-stone-200 px-2 py-1 uppercase text-xs font-medium text-stone-400 hover:bg-stone-100'
              onClick={() => handleEditGenre()}
              disabled={isLoading}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
      {genre.children.length > 0 && expanded && (
        <ul className='mt-2 ml-4 space-y-2 border-l border-stone-400'>
          {genre.children.map((id) => (
            <li className='pl-4' key={id}>
              <Node
                id={id}
                expanded={expanded === 'all' ? expanded : undefined}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TreeView
