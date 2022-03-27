import '../common/styles/globals.css'

import { withTRPC } from '@trpc/next'
import cookies from 'cookie'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'

import ErrorBoundary from '../common/components/ErrorBoundary'
import Navbar from '../common/components/Navbar'
import { tokenKey } from '../common/utils/auth'
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
  config: ({ ctx }) =>
    isBrowser
      ? { url: trpcPath }
      : {
          url: trpcUrl,
          headers: () => {
            // tRPC context does not receive cookies when using SSR, but it does receive headers.
            // Here we forward the token cookie through the Authorization header so the tRPC context
            // can receive it.

            const cookieStr = ctx?.req?.headers.cookie

            if (cookieStr) {
              const cookie = cookies.parse(cookieStr)
              const token = cookie[tokenKey]
              return token ? { Authorization: `Bearer ${token}` } : {}
            }

            return {}
          },
        },
  ssr: true,
})(MyApp)
