import React, { Fragment, useEffect, useState } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Button } from '../../../components/Button'
import { Gutter } from '../../../components/Gutter'
import { Media } from '../../../components/Media'
import { Price } from '../../../components/Price'
import { VerticalPadding } from '../../../components/VerticalPadding'
import { getApolloClient } from '../../../graphql'
import { HEADER_QUERY } from '../../../graphql/globals'
import { Order as OrderType } from '../../../payload-types'
import { useAuth } from '../../../providers/Auth'

import classes from './index.module.scss'

const Order: React.FC = () => {
  const [error] = useState('')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const router = useRouter()
  const { query } = router
  const [order, setOrder] = useState<OrderType>()
  const [total, setTotal] = useState<{
    formatted: string
    raw: number
  }>({
    formatted: '0.00',
    raw: 0,
  })

  useEffect(() => {
    setLoading(true)

    if (user && query.id) {
      // no real need to add a 'where' query here since the access control is handled by the API
      const fetchOrder = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/orders/${query.id}`, {
          credentials: 'include',
        })

        if (response.ok) {
          const json = await response.json()
          setOrder(json)
        }

        setLoading(false)
      }
      fetchOrder()
    }
  }, [user, query])

  useEffect(() => {
    if (user === null) {
      router.push(`/login?unauthorized=account`)
    }
  }, [user, router])

  useEffect(() => {
    if (order) {
      const newTotal = order?.items?.reduce((acc, item) => {
        return (
          acc +
          (typeof item.product === 'object'
            ? JSON.parse(item.product.priceJSON)?.data?.[0]?.unit_amount * item.quantity
            : 0)
        )
      }, 0)

      setTotal({
        formatted: (newTotal / 100).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        }),
        raw: newTotal,
      })
    }
  }, [order])

  return (
    <VerticalPadding top="header" bottom="none">
      <Gutter className={classes.orders}>
        <h1>Order</h1>
        <p>{`Order ID: ${query.id}`}</p>
        {error && (
          <div className={classes.error}>
            Could not load order <span className={classes.orderId}>{query.id}</span>. Please try
            again.
          </div>
        )}
        {loading && <div className={classes.loading}>{`Loading order ${query.id}...`}</div>}
        {order && (
          <div className={classes.order}>
            <h4 className={classes.orderTitle}>Items</h4>
            {order.items.map((item, index) => {
              if (typeof item.product === 'object') {
                const {
                  quantity,
                  product,
                  product: {
                    title,
                    meta: { image: metaImage },
                  },
                } = item

                const isLast = index === order.items.length - 1

                return (
                  <Fragment key={index}>
                    <div className={classes.row}>
                      <div className={classes.mediaWrapper}>
                        {!metaImage && <span className={classes.placeholder}>No image</span>}
                        {metaImage && typeof metaImage !== 'string' && (
                          <Media imgClassName={classes.image} resource={metaImage} fill />
                        )}
                      </div>
                      <div className={classes.rowContent}>
                        <Link href={`/products/${product.slug}`}>
                          <h6 className={classes.title}>{title}</h6>
                        </Link>
                        <label>Quantity: {quantity}</label>
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
          </div>
        )}
        <h4>
          {/* TODO: get actual price */}
          {`Order Total: ${total.formatted}`}
        </h4>
        <br />
        <Button href="/orders" appearance="primary" label="See all orders" />
        <br />
        <br />
        <Button href="/account" appearance="secondary" label="Go to account" />
      </Gutter>
    </VerticalPadding>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = getApolloClient()

  const { data } = await apolloClient.query({
    query: HEADER_QUERY,
  })

  return {
    props: {
      header: data?.Header || null,
      footer: data?.Footer || null,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
}

export default Order
