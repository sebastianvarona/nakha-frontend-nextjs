import React, { useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Button } from '../../components/Button'
import { Gutter } from '../../components/Gutter'
import { VerticalPadding } from '../../components/VerticalPadding'
import { getApolloClient } from '../../graphql'
import { HEADER_QUERY } from '../../graphql/globals'
import { Media, Order, Product } from '../../payload-types'
import { useAuth } from '../../providers/Auth'
import { formatLocaleRelative } from '../../utilities/formatDateTime'

import classes from './index.module.scss'

const Orders: React.FC = () => {
  const [error] = useState('')
  const [success, setSuccess] = useState('')
  const { user } = useAuth()

  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>()

  useEffect(() => {
    if (user) {
      // no need to add a 'where' query here, the access control is handled by the API
      const fetchOrders = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/orders`, {
          credentials: 'include',
        })

        if (response.ok) {
          const json = await response.json()
          setOrders(json.docs)
        }
      }
      fetchOrders()
    }
  }, [user])

  useEffect(() => {
    if (user === null) {
      router.push(`/login?unauthorized=account`)
    }
  }, [user, router])

  useEffect(() => {
    if (typeof router.query.success === 'string') {
      setSuccess(router.query.success)
    }
  }, [router])

  return (
    <VerticalPadding top="header">
      <Gutter className={classes.orders}>
        <h1>Orders</h1>
        {error && <div className={classes.error}>{error}</div>}
        {success && <div className={classes.success}>{success}</div>}
        {!orders || (orders.length === 0 && <p>You have no orders.</p>)}

        {orders && orders.length > 0 && (
          <ul className={classes.ordersList}>
            {orders.map((order, i) => (
              <li key={order.id} className={i % 2 === 0 ? classes.secondary : ''}>
                <div>{formatLocaleRelative(order.createdAt)}</div>
                <div className={classes.item}>
                  <div className={classes.link}>
                    View Order:
                    <Link href={`/orders/${order.id}`}>
                      <span>{order.id}</span>
                    </Link>
                  </div>
                  <div className={classes.productsRow}>
                    {order.items.map(item => {
                      const product = item.product as Product
                      const media = product?.meta?.image as Media
                      return (
                        <div key={item.id} className={classes.item}>
                          <div className={classes.itemName}>{item.title}</div>
                          {media?.url && <img src={media.url} alt={`${media.alt}`} />}
                          {!media?.url && <div className={classes.noImage}>No Image</div>}
                          <div className={classes.itemPrice}>x{item.quantity}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Button href="/account" appearance="primary" label="Go to account" />
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

export default Orders
