import { FC, useMemo } from 'react'

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
      <ul>
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

  return (
    <div>
      <div className='border border-gray-200 -mb-px'>
        <div className='px-3 py-1'>
          <div className='font-bold text-lg'>{genre.name}</div>
          <div className='text-gray-800'>{genre.shortDesc}</div>
        </div>
      </div>
      {children.length > 0 && (
        <ul>
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
