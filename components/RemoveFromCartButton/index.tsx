import React from 'react'

import { Product } from '../../payload-types'
import { useCart } from '../../providers/Cart'

import classes from './index.module.scss'

export const RemoveFromCartButton: React.FC<{
  className?: string
  product: Product
  variant?: string
}> = props => {
  const { className, product, variant } = props

  const { deleteItemFromCart, isProductInCart } = useCart()

  const productIsInCart = isProductInCart(product, variant)

  if (!productIsInCart) {
    return <div>Item is not in the cart</div>
  }

  return (
    <button
      type="button"
      onClick={() => {
        deleteItemFromCart({ product, variant })
      }}
      className={[className, classes.removeFromCartButton].filter(Boolean).join(' ')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        width={24}
        height={24}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  )
}
