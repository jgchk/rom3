import styled from '@emotion/styled'
import { FC } from 'react'

import { CorrectionContextProvider } from '../contexts/CorrectionContext'
import Navbar from './Navbar'

const Layout: FC<{ correctionId: number }> = ({ correctionId, children }) => (
  <CorrectionContextProvider id={correctionId}>
    <Container>
      <Navbar />
      <Content>{children}</Content>
    </Container>
  </CorrectionContextProvider>
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
  padding: 24px;
  overflow: auto;
`
