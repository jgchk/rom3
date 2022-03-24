import '../common/styles/globals.css'

import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { withTRPC } from '@trpc/next'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'

import ErrorBoundary from '../common/components/ErrorBoundary'
import Navbar from '../common/components/Navbar'
import { darkTheme } from '../common/themes'
import { isBrowser } from '../common/utils/ssr'
import { trpcPath, trpcUrl } from '../common/utils/trpc'
import { AppRouter } from '../modules/server/routers/_app'

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider theme={darkTheme}>
    <Layout>
      <Navbar />
      <Content>
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </Content>
      <Toaster />
    </Layout>
  </ThemeProvider>
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
  color: ${({ theme }) => theme.color.text['700']};
  background: ${({ theme }) => theme.color.background};
`

const Content = styled.div`
  flex: 1;
  overflow: auto;
`
