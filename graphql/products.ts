import { gql } from '@apollo/client'

import { CALL_TO_ACTION, CONTENT, MEDIA_BLOCK, RELATED_PRODUCTS } from './blocks'
import { CATEGORIES } from './categories'
import { FOOTER, HEADER, SETTINGS } from './globals'
import { META } from './meta'

const VARIANTS = `variants {
    id
    name
  }
`
const ATTRIBUTES = `attributes {
  id
  name
  value
}
`

export const PRODUCTS = gql`
  query Products {
    Products(limit: 300) {
      docs {
        slug
      }
    }
  }
`

export const PRODUCT = gql`
  query Product($slug: String) {
    Products(where: { slug: { equals: $slug}}) {
      docs {
        id
        title
        ${VARIANTS}
        ${ATTRIBUTES}
        detail
        ${CATEGORIES}
        layout {
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
          ${RELATED_PRODUCTS}
        }
        paywall {
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
        }
        priceJSON
        ${META}
      }
    }
    ${HEADER}
    ${FOOTER}
    ${SETTINGS}
  }
`
