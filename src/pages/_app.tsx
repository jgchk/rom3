import '../common/styles/globals.css'

import styled from '@emotion/styled'
import { withTRPC } from '@trpc/next'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'

import ErrorBoundary from '../common/components/ErrorBoundary'
import Navbar from '../common/components/Navbar'
import { isBrowser } from '../common/utils/ssr'
import { trpcPath, trpcUrl } from '../common/utils/trpc'
import { AppRouter } from '../modules/server/routers/_app'

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Layout>
    <Navbar />
    <Content>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </Content>
    <Toaster />
  </Layout>
)

export default withTRPC<AppRouter>({
  config: () => (isBrowser ? { url: trpcPath } : { url: trpcUrl }),
  ssr: true,
})(MyApp)

const Layout = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
`
