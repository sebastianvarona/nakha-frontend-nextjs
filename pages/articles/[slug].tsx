import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'

import { Gutter } from '../../components/Gutter'
import RichText from '../../components/RichText'
import { VerticalPadding } from '../../components/VerticalPadding'
import { getApolloClient } from '../../graphql'
import { ARTICLE, ARTICLES } from '../../graphql/articles'
import { Article as ArticleType, Media } from '../../payload-types'

import classes from './index.module.scss'

export const Article: React.FC<{
  article: ArticleType
  preview?: boolean
}> = props => {
  const { article } = props

  const { query } = useRouter()

  if (article) {
    const { title, content, meta } = article
    const media = meta.image as Media

    return (
      <React.Fragment>
        <VerticalPadding top="header">
          <Gutter>
            <h1 className={classes.title}>{title}</h1>
            <div className={classes.mediaContainer}>
              <div className={classes.mediaWrapper}>
                <img src={media.url} alt={media.alt} />
              </div>
            </div>

            <Grid>
              <Cell cols={8} start={3}>
                <RichText content={content} />
              </Cell>
            </Grid>
          </Gutter>
        </VerticalPadding>
      </React.Fragment>
    )
  }

  return null
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = getApolloClient()

  const { data } = await apolloClient.query({
    query: ARTICLE,
    variables: {
      slug: params?.slug,
    },
  })

  if (!data.Articles.docs[0]) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      article: data?.Articles?.docs?.[0] || null,
      header: data?.Header || null,
      footer: data?.Footer || null,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = getApolloClient()

  const { data } = await apolloClient.query({
    query: ARTICLES,
  })

  return {
    paths: data.Articles.docs.map(({ slug }) => ({
      params: { slug },
    })),
    fallback: 'blocking',
  }
}

export default Article
