import { gql } from '@apollo/client'

import { FOOTER, HEADER, SETTINGS } from './globals'
import { META } from './meta'

export const ARTICLES = gql`
  query Articles {
    Articles(limit: 300) {
      docs {
        slug
      }
    }
  }
`

export const ARTICLE = gql`
  query Article($slug: String) {
    Articles(where: { slug: { equals: $slug}}) {
      docs {
        slug
        id
        title
        location
        date
        extract
        content
        ${META}
      }
    }
    ${HEADER}
    ${FOOTER}
    ${SETTINGS}
  }
`
