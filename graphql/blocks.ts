import { CATEGORIES } from './categories'
import { LINK_FIELDS } from './link'
import { MEDIA, MEDIA_FIELDS } from './media'
import { META } from './meta'

export const CALL_TO_ACTION = `
...on Cta {
  blockType
  richText
  links {
    link ${LINK_FIELDS()}
  }
}
`

export const CONTENT = `
...on Content {
  blockType
  backgroundColor
  columns {
    size
    richText
    enableLink
    link ${LINK_FIELDS()}
  }
}
`

export const MEDIA_BLOCK = `
...on MediaBlock {
  blockType
  mediaBlockBackgroundColor
  position
  ${MEDIA}
}
`

export const ARCHIVE_BLOCK = `
...on Archive {
  blockType
  introContent
  populateBy
  relationTo
  ${CATEGORIES}
  limit
  selectedDocs {
    relationTo
    value {
      ...on Product {
        id
        slug
        title
        priceJSON
      }
    }
  }
  populatedDocs {
    relationTo
    value {
      ...on Product {
        id
        slug
        title
        priceJSON
        ${CATEGORIES}
        ${META}
      }
    }
  }
  populatedDocsTotal
}
`

export const IMAGE_CONTENT_COLLAGE = `
... on ImageContentCollage {
  blockType
  richText
  images {
    image {
      ${MEDIA_FIELDS}
    }
  }
}
`

export const CTA_WITH_IMAGE = `
... on CtaWithImage {
  blockType
  title
  richText
  side
  image {
    ${MEDIA_FIELDS}
  }
  imageContent
  link {
    type
    reference {
      relationTo
      value {
        ...on Page {
          slug
        }
      }
    }
    label
    appearance
  }
}
`

export const INFO_GRID = `
... on InfoGrid {
  blockType
  infoGrid {
    title
    description
    image {
      ${MEDIA_FIELDS}
    }
  }
}
`

export const FEATURED_PRODUCTS = `
... on FeaturedProducts {
  blockType
  title
  selectedProducts {
    value {
      ...on Product {
        id
        slug
        title
        priceJSON
        ${CATEGORIES}
        ${META}
      }
    }
  }
}
`
