import React, { Fragment, useEffect } from 'react'
import { gql } from '@apollo/client'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { CheckoutForm } from '../../components/CheckoutForm'
import { Gutter } from '../../components/Gutter'
import { Media } from '../../components/Media'
import { Price } from '../../components/Price'
import { VerticalPadding } from '../../components/VerticalPadding'
import { getApolloClient } from '../../graphql'
import { FOOTER, HEADER, SETTINGS } from '../../graphql/globals'
import { Settings } from '../../payload-types'
import { useAuth } from '../../providers/Auth'
import { useCart } from '../../providers/Cart'

import classes from './index.module.scss'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const stripe = loadStripe(apiKey)

const CheckoutPage: React.FC<{
  settings: Settings
}> = props => {
  const {
    settings: { shopPage },
  } = props

  const { user } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState(null)
  const [clientSecret, setClientSecret] = React.useState()
  const hasMadePaymentIntent = React.useRef(false)

  const { cart, cartIsEmpty, cartTotal } = useCart()

  useEffect(() => {
    if (user === null) {
      router.push('/account/login?unauthorized=account')
    }
  }, [router, user])

  useEffect(() => {
    if (user !== null && cartIsEmpty) {
      router.push('/cart')
    }
  }, [router, user, cartIsEmpty])

  useEffect(() => {
    if (user && cart && hasMadePaymentIntent.current === false) {
      hasMadePaymentIntent.current = true

      const makeIntent = async () => {
        try {
          const req = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/checkout`, {
            method: 'POST',
            credentials: 'include',
          })

          const res = await req.json()

          if (res.error) {
            setError(res.error)
          } else if (res.client_secret) {
            setError(null)
            setClientSecret(res.client_secret)
          }
        } catch (e) {
          setError('Something went wrong.')
        }
      }

      makeIntent()
    }
  }, [cart, user])

  if (!user || !stripe) return null

  return (
    <VerticalPadding top="large">
      <Gutter className={classes.checkoutPage}>
        {!clientSecret && !error && <div className={classes.loading}>Loading...</div>}
        {!clientSecret && error && (
          <div className={classes.error}>
            <p>Error:</p>
            {error}
          </div>
        )}
        {clientSecret && (
          <Elements
            stripe={stripe}
            options={{
              clientSecret,
              appearance: {
                theme: 'flat',
                variables: {
                  borderRadius: '0px',
                  colorBackground: 'rgb(20, 20, 20)',
                  colorPrimary: 'rgb(255, 255, 255)',
                  colorText: 'rgb(255, 255, 255)',
                  focusBoxShadow: '',
                },
              },
            }}
          >
            <h1 className={classes.title}>Checkout</h1>
            {error && <p>{error}</p>}
            <Grid>
              <Cell cols={6} colsM={12}>
                {cartIsEmpty && (
                  <div>
                    {'Your '}
                    <Link href="/cart">cart</Link>
                    {' is empty.'}
                    {typeof shopPage === 'object' && shopPage?.slug && (
                      <Fragment>
                        {' '}
                        <Link href={`/${shopPage.slug}`}>Continue shopping?</Link>
                      </Fragment>
                    )}
                  </div>
                )}
                {!cartIsEmpty && (
                  <div className={classes.items}>
                    {cart.items.map((item, index) => {
                      if (typeof item.product === 'object') {
                        const {
                          quantity,
                          product,
                          product: {
                            title,
                            meta: { image: metaImage },
                          },
                        } = item

                        const isLast = index === cart.items.length - 1

                        return (
                          <Fragment key={index}>
                            <div className={classes.row}>
                              <div className={classes.mediaWrapper}>
                                {!metaImage && (
                                  <span className={classes.placeholder}>No image</span>
                                )}
                                {metaImage && typeof metaImage !== 'string' && (
                                  <Media imgClassName={classes.image} resource={metaImage} fill />
                                )}
                              </div>
                              <div className={classes.rowContent}>
                                <Link href={`/products/${product.slug}`}>
                                  <h6 className={classes.title}>{title}</h6>
                                </Link>
                                <label>
                                  Quantity &nbsp;
                                  <span className={classes.quantity}>{quantity}</span>
                                </label>
                                <label className={classes.price}>
                                  Price: <Price product={product} button={false} />
                                </label>
                              </div>
                            </div>
                            {!isLast && <hr className={classes.rowHR} />}
                          </Fragment>
                        )
                      }
                      return null
                    })}
                    <div
                      className={classes.orderTotal}
                    >{`Order total: ${cartTotal.formatted}`}</div>
                  </div>
                )}
              </Cell>
              <Cell cols={6} colsM={12} className={classes.checkoutForm}>
                <CheckoutForm />
              </Cell>
            </Grid>
          </Elements>
        )}
      </Gutter>
    </VerticalPadding>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = getApolloClient()

  const { data } = await apolloClient.query({
    query: gql(`
      query {
        ${HEADER}
        ${FOOTER}
        ${SETTINGS}
      }
    `),
  })

  return {
    props: {
      header: data?.Header || null,
      footer: data?.Footer || null,
      settings: data?.Settings || null,
    },
  }
}

export default CheckoutPage
