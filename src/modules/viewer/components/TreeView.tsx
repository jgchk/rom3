import Link from 'next/link'
import { FC, useMemo } from 'react'

import { GenreApiOutput } from '../../../common/model'
import { useGenreQuery } from '../../../common/services/genres'
import { TreeProvider, useGenreTree } from '../contexts/TreeContext'
import useGenreTreeQuery, { GenreTree } from '../hooks/useGenreTreeQuery'

const TreeView: FC<{ parentId?: number }> = ({ parentId }) =>
  parentId !== undefined ? <HasParent parentId={parentId} /> : <NoParent />

const HasParent: FC<{ parentId: number }> = ({ parentId }) => {
  const { data: treeData } = useGenreTreeQuery()
  const { data: genreData } = useGenreQuery(parentId)

  if (treeData) {
    return <Tree tree={treeData} parentGenre={genreData} />
  }

  return <div>Loading...</div>
}

const NoParent: FC = () => {
  const { data: treeData } = useGenreTreeQuery()

  if (treeData) {
    return <Tree tree={treeData} />
  }

  return <div>Loading...</div>
}

const Tree: FC<{ tree: GenreTree; parentGenre?: GenreApiOutput }> = ({
  tree,
  parentGenre,
}) => {
  const topLevelGenres = useMemo(
    () =>
      (parentGenre
        ? parentGenre.children.map((id) => tree[id])
        : Object.values(tree).filter((genre) => genre.parents.length === 0)
      ).sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      ),
    [parentGenre, tree]
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

  return (
    <div className='border border-stone-300 bg-white shadow-sm'>
      <div className='p-2'>
        <div className='text-xs font-bold text-stone-500'>
          {genre.type}
          {genre.trial && <> (TRIAL)</>}
        </div>
        <div className='text-lg font-medium mt-0.5'>
          <Link href={`/genres/${id}`}>
            <a className='hover:underline'>{genre.name}</a>
          </Link>
        </div>
        <div className='text-sm text-stone-700 mt-1'>{genre.shortDesc}</div>
      </div>
    </div>
  )
}

export default TreeView
