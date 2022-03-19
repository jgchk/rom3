import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FC } from 'react'

import { GenreName } from '../../modules/genres/model'
import { useGenresQuery } from '../../modules/genres/services'

const Create: NextPage = () => {
  const router = useRouter()

  return (
    <Layout>
      <Content>
        <button>New Genre</button>
        <GenreList
          onEdit={(type: GenreName, id: number) =>
            void router.push({
              pathname: '/corrections/create',
              query: { action: 'edit', type, id },
            })
          }
          onDelete={(type: GenreName, id: number) =>
            void router.push({
              pathname: '/corrections/create',
              query: { action: 'delete', type, id },
            })
          }
        />
      </Content>
    </Layout>
  )
}

const GenreList: FC<{
  onEdit: (type: GenreName, id: number) => void
  onDelete: (type: GenreName, id: number) => void
}> = ({ onEdit, onDelete }) => {
  const { data, error } = useGenresQuery({
    type: ['meta', 'scene', 'style', 'trend'],
  })

  if (data) {
    return (
      <div>
        {data.map((item) => (
          <div key={item.id}>
            {item.name}
            <button onClick={() => onEdit(item.type, item.id)}>Edit</button>
            <button onClick={() => onDelete(item.type, item.id)}>Delete</button>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div>Error</div>
  }

  return <div>Loading...</div>
}

export default Create

const Layout = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 500px;
`
