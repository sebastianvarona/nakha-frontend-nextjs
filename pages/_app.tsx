import React, { useCallback } from 'react'
import { GridProvider } from '@faceless-ui/css-grid'
import { ModalContainer, ModalProvider } from '@faceless-ui/modal'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { AdminBar } from '../components/AdminBar'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import cssVariables from '../cssVariables'
import { Footer as FooterType, Header as HeaderType } from '../payload-types'
import { AuthProvider } from '../providers/Auth'
import { CartProvider } from '../providers/Cart'

import '../css/app.scss'

const PayloadApp = (
  appProps: AppProps<{
    id: string
    preview: boolean
    collection: string
    header: HeaderType
    footer: FooterType
  }>,
): React.ReactElement => {
  const { Component, pageProps } = appProps

  const { collection, id, preview } = pageProps

  const router = useRouter()

  const onPreviewExit = useCallback(() => {
    const exit = async () => {
      const exitReq = await fetch('/api/exit-preview')
      if (exitReq.status === 200) {
        router.reload()
      }
    }
    exit()
  }, [router])

  return (
    <AuthProvider>
      <Head>
        {/* Favicon Files */}
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin /> */}
        <link
          href="https://fonts.googleapis.com/css2?family=Quattrocento+Sans:wght@400;700&family=Quattrocento:wght@400;700&family=Raleway:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Open Graph */}

        {/* <!-- HTML Meta Tags --> */}
        <title>
          NAKHA | Taste the Difference - Discover the essence of premium Colombian coffee
        </title>
        <meta
          name="description"
          content="At NAKHA, our philosophy is simple: to bring people together over exceptional coffee. We believe that coffee is more than just a drink - it's a catalyst for connection, conversation, and community. That's why we are dedicated to crafting the finest blends from around the world, using only the highest quality beans and roasting methods. But our commitment to excellence goes beyond just the coffee itself."
        />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://www.nakha.coffee" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="NAKHA | Taste the Difference - Discover the essence of premium Colombian coffee"
        />
        <meta
          property="og:description"
          content="At NAKHA, our philosophy is simple: to bring people together over exceptional coffee. We believe that coffee is more than just a drink - it's a catalyst for connection, conversation, and community. That's why we are dedicated to crafting the finest blends from around the world, using only the highest quality beans and roasting methods. But our commitment to excellence goes beyond just the coffee itself."
        />
        <meta property="og:image" content="https://www.nakha.coffee/open-graph-min.jpeg" />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="nakha.coffee" />
        <meta property="twitter:url" content="https://www.nakha.coffee" />
        <meta
          name="twitter:title"
          content="NAKHA | Taste the Difference - Discover the essence of premium Colombian coffee"
        />
        <meta
          name="twitter:description"
          content="At NAKHA, our philosophy is simple: to bring people together over exceptional coffee. We believe that coffee is more than just a drink - it's a catalyst for connection, conversation, and community. That's why we are dedicated to crafting the finest blends from around the world, using only the highest quality beans and roasting methods. But our commitment to excellence goes beyond just the coffee itself."
        />
        <meta name="twitter:image" content="https://www.nakha.coffee/open-graph-min.jpeg" />
      </Head>
      <CartProvider>
        <GridProvider
          breakpoints={{
            s: cssVariables.breakpoints.s,
            m: cssVariables.breakpoints.m,
            l: cssVariables.breakpoints.l,
          }}
          colGap={{
            s: '24px',
            m: '48px',
            l: '48px',
            xl: '72px',
          }}
          cols={{
            s: 12,
            m: 12,
            l: 12,
            xl: 12,
          }}
        >
          <ModalProvider transTime={0} zIndex="var(--modal-z-index)">
            <AdminBar
              adminBarProps={{
                collection,
                id,
                preview,
                onPreviewExit,
              }}
            />
            <Header header={pageProps.header} />
            <Component {...pageProps} />
            <Footer footer={pageProps.footer} />
            <ModalContainer />
          </ModalProvider>
        </GridProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default PayloadApp
