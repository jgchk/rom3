import { FC, useMemo } from 'react'

import useGenreTypeColor from '../../../common/hooks/useGenreTypeColor'
import { TreeProvider, useGenreTree } from '../contexts/TreeContext'
import useGenreTreeQuery, { GenreTree } from '../hooks/useGenreTreeQuery'

const TreeView: FC = () => {
  const { data } = useGenreTreeQuery()

  if (data) {
    return <Tree tree={data} />
  }

  return <div>Loading...</div>
}

const Tree: FC<{ tree: GenreTree }> = ({ tree }) => {
  const topLevelGenres = useMemo(
    () =>
      Object.values(tree.genres).filter((genre) => genre.parents.length === 0),
    [tree.genres]
  )

  return (
    <TreeProvider tree={tree}>
      <ul className='space-y-2'>
        {topLevelGenres.map((genre) => (
          <li key={genre.id}>
            <Node id={genre.id} />
          </li>
        ))}
      </ul>
    </TreeProvider>
  )
}

const Node: FC<{ id: number }> = ({ id }) => {
  const tree = useGenreTree()

  const genre = useMemo(() => tree.genres[id], [id, tree.genres])
  const children = useMemo(() => tree.children[id] ?? [], [id, tree.children])

  const color = useGenreTypeColor(genre.type)

  return (
    <div>
      <div className='border border-stone-300 bg-white shadow-sm p-2'>
        <div className='text-xs font-bold'>
          <span className={color}>{genre.type}</span>
          {genre.trial && (
            <>
              {' '}
              <span className='text-stone-500'>(TRIAL)</span>
            </>
          )}
        </div>
        <div className='text-lg font-medium mt-0.5'>{genre.name}</div>
        <div className='text-sm text-stone-700 mt-1'>{genre.shortDesc}</div>
      </div>
      {children.length > 0 && (
        <ul className='mt-2 space-y-2'>
          {children.map((id) => (
            <li className='pl-8' key={id}>
              <Node id={id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TreeView
