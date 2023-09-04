import { gql } from '@apollo/client'

import {
  ARCHIVE_BLOCK,
  CALL_TO_ACTION,
  CONTENT,
  CTA_WITH_IMAGE,
  FAQ,
  FEATURED_PRODUCTS,
  IMAGE_CONTENT_COLLAGE,
  INFO_GRID,
  MEDIA_BLOCK,
} from './blocks'
import { FOOTER, HEADER, SETTINGS } from './globals'
import { LINK_FIELDS } from './link'
import { MEDIA } from './media'
import { META } from './meta'

export const PAGES = gql`
  query Pages {
    Pages(limit: 300, where: { slug: { not_equals: "cart" } }) {
      docs {
        slug
      }
    }
  }
`

export const PAGE = gql`
  query Page($slug: String ) {
    Pages(where: { AND: [{ slug: { equals: $slug }}] }) {
      docs {
        id
        title
        hero {
          type
          richText
          links {
            link ${LINK_FIELDS()}
          }
          ${MEDIA}
        }
        layout {
          ${CONTENT}
          ${CALL_TO_ACTION}
          ${IMAGE_CONTENT_COLLAGE}
          ${CTA_WITH_IMAGE}
          ${MEDIA_BLOCK}
          ${INFO_GRID}
          ${ARCHIVE_BLOCK}
          ${FEATURED_PRODUCTS}
          ${FAQ}
        }
        ${META}
      }
    }
    ${HEADER}
    ${FOOTER}
    ${SETTINGS}
  }
`
