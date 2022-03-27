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
        rel='preload'
        href='/fonts/P22Mackinac/P22Mackinac-ExtraBold.otf'
        as='font'
        crossOrigin=''
      />
      <link
        rel='preload'
        href='/fonts/OpenSans/OpenSans-VariableFont_wdth,wght.ttf'
        as='font'
        crossOrigin=''
      />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
)

export default Document
