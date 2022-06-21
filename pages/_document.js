import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="color-scheme" content="dark"></meta>
      </Head>
      <body className="bg-gray-800 text-gray-200">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}