import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="zh">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/icons/icon-192.png" />
        {/* 可加更多meta */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
