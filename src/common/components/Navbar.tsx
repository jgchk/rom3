import styled from '@emotion/styled'
import Link from 'next/link'
import { FC } from 'react'

const Navbar: FC = () => (
  <Container>
    <Link href='/genres/tree'>
      <a>Tree</a>
    </Link>
    <Link href='/corrections'>
      <a>Corrections</a>
    </Link>
  </Container>
)

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
