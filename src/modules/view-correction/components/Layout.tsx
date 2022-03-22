import styled from '@emotion/styled'
import { FC } from 'react'

import Navbar from './Navbar'

const Layout: FC<{ correctionId: number }> = ({ correctionId, children }) => (
  <Container>
    <Navbar correctionId={correctionId} />
    <Content>{children}</Content>
  </Container>
)

export default Layout

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const Content = styled.div`
  flex: 1;
  overflow: auto;
`
