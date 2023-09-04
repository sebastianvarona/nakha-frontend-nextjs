import { gql } from '@apollo/client'
import { LINK_FIELDS } from './link'

export const HEADER = `
  Header {
    navItems {
      link ${LINK_FIELDS({ disableAppearance: true })}
		}
  }
`

export const HEADER_QUERY = gql`
query Header {
  ${HEADER}
}
`

export const FOOTER = `
  Footer {
    copyright
    navItems {
      link ${LINK_FIELDS({ disableAppearance: true })}
		}
  }
`

export const FOOTER_QUERY = gql`
query Footer {
  ${FOOTER}
}
`

export const SETTINGS = `
  Settings {
    shopPage {
      slug
    }
  }
`

export const SETTINGS_QUERY = gql`
query Settings {
  ${SETTINGS}
}
`

export const GLOBALS_QUERY = gql`
query Globals {
  ${HEADER}
  ${FOOTER}
  ${SETTINGS}
}
`
