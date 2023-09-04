import React from 'react'
import { GetStaticProps } from 'next'

import { Blocks } from '../../components/Blocks'
import { getApolloClient } from '../../graphql'
import { GLOBALS_QUERY } from '../../graphql/globals'
import { Page as PageType } from '../../payload-types'

export const ContactPage: React.FC<{
  page: PageType
  preview?: boolean
}> = props => {
  const { page } = props

  if (page) {
    const { layout } = page

    return (
      <React.Fragment>
        <Blocks blocks={layout} />
      </React.Fragment>
    )
  }

  return null
}

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = getApolloClient()

  const globals = await apolloClient.query({
    query: GLOBALS_QUERY,
  })

  const pageQuery = await fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/pages?where[slug][equals]=contact`,
  ).then(res => res.json())

  if (!pageQuery.docs[0]) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      page: pageQuery.docs[0] || null,
      header: globals.data?.Header || null,
      footer: globals.data?.Footer || null,
    },
  }
}

export default ContactPage
