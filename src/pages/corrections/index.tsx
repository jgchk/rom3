import styled from '@emotion/styled'
import { NextPage } from 'next'

import CorrectionsList from '../../modules/correction/components/CorrectionsList'

const CorrectionsPage: NextPage = () => (
  <Layout>
    <CorrectionsList />
  </Layout>
)

export default CorrectionsPage

const Layout = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  overflow: auto;
`
