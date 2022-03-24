import styled from '@emotion/styled'
import Link from 'next/link'
import { FC, useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'

import { genreTypes } from '../../../common/model'
import { genreChildTypes } from '../../../common/model/parents'
import { useDeleteCorrectionGenreMutation } from '../../../common/services/corrections'
import { capitalize } from '../../../common/utils/string'
import { useCorrectionContext } from '../contexts/CorrectionContext'
import { TreeProvider, useGenreTree } from '../contexts/TreeContext'
import useCorrectionGenreTreeQuery, {
  GenreTree,
} from '../hooks/useCorrectionGenreTreeQuery'

const TreeView: FC = () => {
  const { id: correctionId } = useCorrectionContext()
  const { data } = useCorrectionGenreTreeQuery(correctionId)

  if (data) {
    return <Tree tree={data} />
  }

  return <div>Loading...</div>
}

const Tree: FC<{ tree: GenreTree }> = ({ tree }) => {
  const { id: correctionId } = useCorrectionContext()

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
          <ButtonContainer>
            {genreTypes.map((genreType) => (
              <Link
                key={genreType}
                href={{
                  pathname: `/corrections/${correctionId}/edit/genres/create`,
                  query: { type: genreType },
                }}
              >
                <a>Add {capitalize(genreType)}</a>
              </Link>
            ))}
          </ButtonContainer>
        </NodeList>
      </Layout>
    </TreeProvider>
  )
}

const Node: FC<{ id: number }> = ({ id }) => {
  const { id: correctionId } = useCorrectionContext()
  const tree = useGenreTree()

  const genre = useMemo(() => tree.genres[id], [id, tree.genres])
  const children = useMemo(() => tree.children[id] ?? [], [id, tree.children])

  const childTypes = useMemo(() => genreChildTypes[genre.type], [genre.type])

  const { mutate } = useDeleteCorrectionGenreMutation()
  const handleDelete = useCallback(
    () =>
      mutate(
        { id: correctionId, targetId: id },
        {
          onSuccess: () => {
            toast.success(`Deleted ${genre.name} in correction`)
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ),
    [correctionId, genre.name, id, mutate]
  )

  return (
    <div>
      <NodeContent>
        <NodeHeader>
          <Link
            href={{
              pathname: `/corrections/${correctionId}/edit/genres/edit`,
              query: { genreId: id },
            }}
          >
            <a className='big'>{genre.name}</a>
          </Link>
          <NodeDesc>{genre.shortDesc}</NodeDesc>
          <ButtonContainer>
            <button onClick={() => handleDelete()}>Delete</button>
            {childTypes.map((childType) => (
              <Link
                key={childType}
                href={{
                  pathname: `/corrections/${correctionId}/edit/genres/create`,
                  query: {
                    type: childType,
                    parentId: id,
                  },
                }}
              >
                <a>Add Child {capitalize(childType)}</a>
              </Link>
            ))}
          </ButtonContainer>
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
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
  color: ${({ theme }) => theme.color.text['500']};
`

const NodeList = styled.ul`
  padding-left: 0;
`

const NodeListItem = styled.li<{ root?: boolean }>`
  display: block;
  padding-left: ${({ root }) => (root ? 0 : 48)}px;
`
