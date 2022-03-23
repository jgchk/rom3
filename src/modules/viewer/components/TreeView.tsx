import styled from '@emotion/styled'
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
      <Layout>
        <NodeList>
          {topLevelGenres.map((genre) => (
            <NodeListItem key={genre.id} root>
              <Node id={genre.id} />
            </NodeListItem>
          ))}
        </NodeList>
      </Layout>
    </TreeProvider>
  )
}

const Node: FC<{ id: number }> = ({ id }) => {
  const tree = useGenreTree()

  const genre = useMemo(() => tree.genres[id], [id, tree.genres])
  const children = useMemo(() => tree.children[id] ?? [], [id, tree.children])

  return (
    <div>
      <NodeContent>
        <NodeHeader>
          <div>{genre.name}</div>
          <NodeDesc>{genre.shortDesc}</NodeDesc>
        </NodeHeader>
      </NodeContent>
      {children.length > 0 && (
        <NodeList>
          {children.map((id) => (
            <NodeListItem key={id}>
              <Node id={id} />
            </NodeListItem>
          ))}
        </NodeList>
      )}
    </div>
  )
}

export default TreeView

const Layout = styled.div`
  padding: 0 12px;
`

const NodeContent = styled.div`
  margin-bottom: -1px;
  border: 1px solid gray;
`

const NodeHeader = styled.div`
  padding: 6px 12px;

  a.big {
    font-weight: bold;
    font-size: 1.3em;
  }
`

const NodeDesc = styled.div`
  color: #161515;
`

const NodeList = styled.ul`
  padding-left: 0;
`

const NodeListItem = styled.li<{ root?: boolean }>`
  display: block;
  padding-left: ${({ root }) => (root ? 0 : 48)}px;
`
