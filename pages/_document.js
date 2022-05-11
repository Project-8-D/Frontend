import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head />
      <body className="bg-gray-800 text-gray-200 sm:overflow-hidden md:overflow-auto">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}