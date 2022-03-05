import '../styles/globals.css'

import styled from '@emotion/styled'
import { withTRPC } from '@trpc/next'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'

import Navbar from '../components/Navbar'
import { AppRouter } from './api/trpc/[trpc]'

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Layout>
    <Navbar />
    <Content>
      <Component {...pageProps} />
    </Content>
    <Toaster />
  </Layout>
)

export default withTRPC<AppRouter>({
  config: () => {
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : 'http://localhost:3000/api/trpc'
    return { url }
  },
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
