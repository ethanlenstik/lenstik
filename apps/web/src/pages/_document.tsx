import Document, { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'
import React from 'react'
import { IS_MAINNET, STATIC_ASSETS } from 'utils'

class LenstubeDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link
            rel="shortcut icon"
            href={`/favicon.ico`}
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={`/apple-touch-icon.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`/favicon-32x32.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={`/favicon-16x16.png`}
          />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#000000" />

          {IS_MAINNET && (
            <Script
              strategy="lazyOnload"
              id="tinybird"
              defer
              src="https://unpkg.com/@tinybirdco/flock.js"
              data-host="https://api.tinybird.co"
              data-token="p.eyJ1IjogImI1YzEwMWY0LTY0MmMtNDJhNy1hZmMxLWIwMjNkZjU2ZWY5YiIsICJpZCI6ICIzY2RmMjVmNi1lMmQ4LTQ3MGItYmFlMy02MDBlMDU4MDQyN2EifQ.67XL26aJbQyvWHEFpyzg38DA3OHRpdIVsQ4FdyD2G5A"
            />
          )}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-3F83LKFJ7C"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-3F83LKFJ7C');
        `}
          </Script>
        </Head>
        {/* className="bg-[url('/compare.png')] bg-cover bg-center" */}
        <body >
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default LenstubeDocument
