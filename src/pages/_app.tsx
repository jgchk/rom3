import '../common/styles/globals.css'

import { withTRPC } from '@trpc/next'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'

import ErrorBoundary from '../common/components/ErrorBoundary'
import Navbar from '../common/components/Navbar'
import { isBrowser } from '../common/utils/ssr'
import { trpcPath, trpcUrl } from '../common/utils/trpc'
import { AppRouter } from '../modules/server/routers/_app'

const MyApp = ({ Component, pageProps }: AppProps) => (
  <div className='w-screen h-screen flex flex-col'>
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
  config: () => (isBrowser ? { url: trpcPath } : { url: trpcUrl }),
  ssr: true,
})(MyApp)
