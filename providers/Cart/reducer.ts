import type { Product, User } from '../../payload-types'

type CartType = User['cart']

export type CartItem = User['cart']['items'][0]

function findIdIndex(arr: any[], item): number {
  const productId = typeof item.product === 'string' ? item.product : item.product.id
  const variantId = item.variant
  return arr.findIndex(({ product, variant }) => {
    const accProductId = typeof product === 'string' ? product : product.id
    console.log({ accProductId, productId, variant, variantId })
    return accProductId === productId && variant === variantId
  })
}

type CartAction =
  | {
      type: 'SET_CART'
      payload: CartType
    }
  | {
      type: 'MERGE_CART'
      payload: CartType
    }
  | {
      type: 'ADD_ITEM'
      payload: CartItem
    }
  | {
      type: 'DELETE_ITEM'
      payload: CartItem
    }
  | {
      type: 'CLEAR_CART'
    }

export const cartReducer = (cart: CartType, action: CartAction) => {
  switch (action.type) {
    case 'SET_CART': {
      return action.payload
    }
    case 'MERGE_CART': {
      const { payload: incomingCart } = action

      const syncedItems: CartItem[] = [
        ...(cart?.items || []),
        ...(incomingCart?.items || []),
      ].reduce((acc, item) => {
        // remove duplicates

        const indexInAcc = findIdIndex(acc, item)

        if (indexInAcc > -1) {
          acc[indexInAcc] = {
            ...acc[indexInAcc],
            // customize the merge logic here, e.g.:
            // quantity: acc[indexInAcc].quantity + item.quantity
          }
        } else {
          acc.push(item)
        }
        return acc
      }, [])

      return {
        ...cart,
        items: syncedItems,
      }
    }
    case 'ADD_ITEM': {
      // if the item is already in the cart, increase the quantity
      const { payload: incomingItem } = action

      const indexInCart = findIdIndex(cart.items, incomingItem)

      let withAddedItem = [...(cart?.items || [])]

      if (indexInCart === -1) {
        withAddedItem.push(incomingItem)
      }

      if (indexInCart > -1) {
        withAddedItem[indexInCart] = {
          ...withAddedItem[indexInCart],
          quantity: incomingItem.quantity > 0 ? incomingItem.quantity : 1,
        }
      }

      return {
        ...cart,
        items: withAddedItem,
      }
    }
    case 'DELETE_ITEM': {
      const { payload: incomingItem } = action
      const withDeletedItem = { ...cart }

      const indexInCart = findIdIndex(cart.items, incomingItem)

      // const indexInCart = cart.items.findIndex(({ product, variant }) => {
      //   const productMatches =
      //     typeof product === 'string'
      //       ? product === incomingProduct.product
      //       : product.id === incomingProduct.product.id
      //   const variantMatches = variant === incomingProduct.variant
      //   // const variantMatches = true

      //   console.log({ productMatches, variantMatches })

      //   return productMatches && variantMatches
      // })

      if (indexInCart > -1) withDeletedItem.items.splice(indexInCart, 1)
      return withDeletedItem
    }
    case 'CLEAR_CART': {
      return {
        ...cart,
        items: [],
      }
    }
    default: {
      return cart
    }
  }
}
