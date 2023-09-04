import { Cell, Grid } from '@faceless-ui/css-grid'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useRef, useState } from 'react'

import { Product } from '../../payload-types'

import qs from 'qs'
import { Card } from '../../components/Card'
import { Gutter } from '../../components/Gutter'
import classes from './index.module.scss'

type Result = {
  totalDocs: number
  docs: Product[]
}

type Props = Extract<Product['layout'][0], { blockType: 'relatedProducts' }>

export const RelatedProducts: React.FC<Props> = props => {
  const {
    title,
    populatedProducts,
    populatedProductsTotal,
    limit,
    categories: catsFromProps,
  } = props

  const [results, setResults] = useState<Result>({
    totalDocs: typeof populatedProductsTotal === 'number' ? populatedProductsTotal : 0,
    docs: populatedProducts?.map(doc => doc.value) || [],
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasHydrated = useRef(false)

  useEffect(() => {
    // hydrate the block with fresh content after first render
    // don't show loader unless the request takes longer than x ms
    // and don't show it during initial hydration
    const timer: NodeJS.Timeout = setTimeout(() => {
      if (hasHydrated) {
        setIsLoading(true)
      }
    }, 500)

    const searchParams = qs.stringify(
      {
        where: {
          ...(catsFromProps?.length > 0
            ? {
                categories: {
                  in:
                    typeof catsFromProps === 'string'
                      ? [catsFromProps]
                      : catsFromProps.map(cat => cat.id).join(','),
                },
              }
            : {}),
        },
        limit,
        depth: 1,
      },
      { encode: false },
    )

    const makeRequest = async () => {
      try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/products?${searchParams}`)
        const json = await req.json()
        clearTimeout(timer)
        hasHydrated.current = true

        const { docs } = json as { docs: Product[] }

        if (docs && Array.isArray(docs)) {
          setResults(json)
          setIsLoading(false)
        }
      } catch (err) {
        console.warn(err) // eslint-disable-line no-console
        setIsLoading(false)
        setError(`Unable to load relatedProducts data at this time.`)
      }
    }

    makeRequest()

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [catsFromProps, limit])

  const router = useRouter()

  return (
    <div className={classes.collectionArchive}>
      <div ref={scrollRef} className={classes.scrollRef} />
      {isLoading && <Gutter>Loading, please wait...</Gutter>}
      {!isLoading && error && <Gutter>{error}</Gutter>}
      {!isLoading && (
        <Fragment>
          <Gutter>
            <h3>{title}</h3>
            <Grid className={classes.grid}>
              {results.docs?.map((result, index) => {
                if (result.slug === router.query.slug) return null
                return (
                  <Cell key={index} className={classes.row} cols={4} colsM={8}>
                    <Card relationTo={'products'} doc={result} />
                  </Cell>
                )
              })}
            </Grid>
          </Gutter>
        </Fragment>
      )}
    </div>
  )
}
