import '../common/styles/globals.css'

import { withTRPC } from '@trpc/next'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'

import ErrorBoundary from '../common/components/ErrorBoundary'
import Navbar from '../common/components/Navbar'
import { getToken } from '../common/utils/auth'
import { isBrowser } from '../common/utils/ssr'
import { trpcPath, trpcUrl } from '../common/utils/trpc'
import { AppRouter } from '../modules/server/routers/_app'

const MyApp = ({ Component, pageProps }: AppProps) => (
  <div className='w-screen h-screen flex flex-col bg-stone-200'>
    <Navbar />
    <div className='flex-1 overflow-auto'>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </div>
    <Toaster />
  </div>
)

export default withTRPC<AppRouter>({
  config: () =>
    isBrowser
      ? {
          url: trpcPath,
          headers: () => {
            const token = getToken()
            return token ? { Authorization: `Bearer ${token}` } : {}
          },
        }
      : { url: trpcUrl },
  ssr: true,
})(MyApp)
