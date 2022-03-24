import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'

const Navbar: FC = () => {
  const router = useRouter()

  return (
    <Container>
      <Logo>Romulus</Logo>
      <Links>
        <Link href='/genres/tree' passHref>
          <NavAnchor active={router.pathname === '/genres/tree'}>
            Tree
          </NavAnchor>
        </Link>
        <Link href='/corrections' passHref>
          <NavAnchor active={router.pathname.startsWith('/corrections')}>
            Corrections
          </NavAnchor>
        </Link>
      </Links>
    </Container>
  )
}

export default Navbar

const Container = styled.nav`
  display: flex;
  gap: 24px;
  align-items: center;
  padding-left: 24px;
`

const Logo = styled.div`
  margin-top: 8px;
  font-weight: bold;
  font-size: 32px;
  font-family: 'P22 Mackinac', serif;
`

const Links = styled.div`
  display: flex;
  padding-bottom: 0;
`

const NavAnchor = styled.a<{ active?: boolean }>`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 8px;
  padding: 2px 8px;
  color: ${({ active, theme }) =>
    active ? theme.color.text['700'] : theme.color.text['300']};
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px solid;
  cursor: pointer;

  &:hover {
    color: ${({ active, theme }) =>
      active ? theme.color.text['900'] : theme.color.text['500']};
  }
`
