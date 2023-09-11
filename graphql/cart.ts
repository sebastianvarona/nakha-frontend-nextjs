import { META } from './meta'

export const CART = `cart {
  items {
    product {
      id
      slug
      title
      priceJSON
      ${META}
    }
    quantity
    variant
  }
}`
