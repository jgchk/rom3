import styled from '@emotion/styled'
import Link from 'next/link'
import { FC, useCallback, useMemo } from 'react'

import { genreTypes } from '../../../common/model'
import { genreChildTypes } from '../../../common/model/parents'
import { capitalize } from '../../../common/utils/string'
import { TreeProvider, useGenreTree } from '../contexts/TreeContext'
import { GenreTree, useGenreTreeQuery } from '../hooks/useGenreTree'
import { CorrectionIdApiInput } from '../services'
import useCorrectionStore from '../state/store'
import { getCorrectionIdApiInputKey } from '../utils/keys'

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
      [...tree.genres.entries()].filter(
        ([, genre]) => genre.parents.length === 0
      ),
    [tree.genres]
  )

  return (
    <TreeProvider tree={tree}>
      <Layout>
        <NodeList>
          {topLevelGenres.map(([id]) => (
            <NodeListItem key={getCorrectionIdApiInputKey(id)} root>
              <Node id={id} />
            </NodeListItem>
          ))}
          <ButtonContainer>
            {genreTypes.map((genreType) => (
              <Link
                key={genreType}
                href={{
                  pathname: '/create',
                  query: { type: genreType },
                }}
              >
                <a>Add Child {capitalize(genreType)}</a>
              </Link>
            ))}
          </ButtonContainer>
        </NodeList>
      </Layout>
    </TreeProvider>
  )
}

const Node: FC<{ id: CorrectionIdApiInput }> = ({ id }) => {
  const tree = useGenreTree()

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const genre = useMemo(() => tree.genres.get(id)!, [id, tree.genres])
  const children = useMemo(
    () => tree.children.get(id) ?? [],
    [id, tree.children]
  )
  /* eslint-enable @typescript-eslint/no-non-null-assertion */

  const childTypes = useMemo(() => genreChildTypes[genre.type], [genre.type])

  const addGenreDelete = useCorrectionStore((state) => state.addGenreDelete)
  const removeCreatedGenre = useCorrectionStore(
    (state) => state.removeCreatedGenre
  )
  const handleDelete = useCallback(() => {
    if (id.type === 'exists') {
      addGenreDelete(id.id)
    } else {
      removeCreatedGenre(id.id)
    }
  }, [addGenreDelete, id.id, id.type, removeCreatedGenre])

  return (
    <div>
      <NodeContent>
        <NodeHeader>
          <Link href={{ pathname: '/edit', query: { id: JSON.stringify(id) } }}>
            <a className='big'>{genre.name}</a>
          </Link>
          <NodeDesc>{genre.shortDesc}</NodeDesc>
          {childTypes.length > 0 && (
            <ButtonContainer>
              <button onClick={() => handleDelete()}>Delete</button>
              {childTypes.map((childType) => (
                <Link
                  key={childType}
                  href={{
                    pathname: '/create',
                    query: {
                      type: childType,
                      parentId: JSON.stringify(id),
                    },
                  }}
                >
                  <a>Add Child {capitalize(childType)}</a>
                </Link>
              ))}
            </ButtonContainer>
          )}
        </NodeHeader>
      </NodeContent>
      {children.length > 0 && (
        <NodeList>
          {children.map((id) => (
            <NodeListItem key={getCorrectionIdApiInputKey(id)}>
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

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 4px;
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
