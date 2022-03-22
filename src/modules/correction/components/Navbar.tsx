import styled from '@emotion/styled'
import Link from 'next/link'
import { FC } from 'react'

import { useCorrectionContext } from '../contexts/CorrectionContext'

const Navbar: FC = () => {
  const { id } = useCorrectionContext()

  return (
    <Container>
      <Link href={`/corrections/${id}/edit`}>
        <a>List</a>
      </Link>
      <Link href={`/corrections/${id}/edit/tree`}>
        <a>Tree</a>
      </Link>
    </Container>
  )
}

export default Navbar

const Container = styled.nav`
  display: flex;
  gap: 4px;
  height: 32px;
  background: #eee;

  a {
    display: flex;
    align-items: center;
    padding: 0 8px;
    color: black;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      background: #ccc;
    }
  }
`
