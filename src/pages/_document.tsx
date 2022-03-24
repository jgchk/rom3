import { Head, Html, Main, NextScript } from 'next/document'
import { FC } from 'react'

const Document: FC = () => (
  <Html>
    <Head>
      <link
        rel='preload'
        href='/fonts/P22Mackinac/P22Mackinac-Book.otf'
        as='font'
        crossOrigin=''
      />
      <link
        rel='preload'
        href='/fonts/P22Mackinac/P22Mackinac-Bold.otf'
        as='font'
        crossOrigin=''
      />
      <link
        href='https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap'
        rel='stylesheet'
      />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
)

export default Document
