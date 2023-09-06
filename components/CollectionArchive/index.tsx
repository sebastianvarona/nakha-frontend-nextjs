import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { useRouter } from 'next/router'
import qs from 'qs'

import type { ArchiveBlockProps } from '../../blocks/ArchiveBlock/types'
import { Product } from '../../payload-types'
import { Card } from '../Card'
import { Gutter } from '../Gutter'
import { PageRange } from '../PageRange'

import classes from './index.module.scss'

type Result = {
  totalDocs: number
  docs: Product[]
  page: number
  totalPages: number
  hasPrevPage: boolean
  hasNextPage: boolean
  nextPage: number
  prevPage: number
}

export type Props = {
  className?: string
  relationTo?: 'products' | 'articles'
  populateBy?: 'collection' | 'selection'
  showPageRange?: boolean
  onResultChange?: (result: Result) => void // eslint-disable-line no-unused-vars
  sort?: string
  limit?: number
  populatedDocs?: ArchiveBlockProps['populatedDocs']
  populatedDocsTotal?: ArchiveBlockProps['populatedDocsTotal']
  categories?: ArchiveBlockProps['categories']
}

export const CollectionArchive: React.FC<Props> = props => {
  const {
    className,
    relationTo,
    showPageRange,
    onResultChange,
    sort = '-createdAt',
    limit,
    populatedDocs,
    populatedDocsTotal,
    categories: catsFromProps,
  } = props
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const [results, setResults] = useState<Result>({
    totalDocs: typeof populatedDocsTotal === 'number' ? populatedDocsTotal : 0,
    docs: populatedDocs?.map(doc => doc.value) || [],
    page: 1,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 1,
    nextPage: 1,
  })

  const {
    // `query` contains both router AND search params
    query: { categories: catsFromQuery, page } = {},
  } = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasHydrated = useRef(false)

  const scrollToRef = useCallback(() => {
    const { current } = scrollRef
    if (current) {
      current.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [])

  useEffect(() => {
    if (typeof page !== 'undefined') {
      scrollToRef()
    }
  }, [isLoading, scrollToRef, page])

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
        sort,
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
          ...(catsFromQuery?.length > 0
            ? {
                categories: {
                  in:
                    typeof catsFromQuery === 'string'
                      ? [catsFromQuery]
                      : catsFromQuery.map(cat => cat).join(','),
                },
              }
            : {}),
        },
        limit,
        page,
        depth: 1,
      },
      { encode: false },
    )
    // const searchParams = qs.stringify(
    //   {
    //     sort,
    //     where: {
    //       ...(selectedCategory
    //         ? {
    //             categories: {
    //               in: [selectedCategory],
    //             },
    //           }
    //         : {}),
    //       // ...
    //     },
    //     // ...
    //   },
    //   { encode: false },
    // )

    const makeRequest = async () => {
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_CMS_URL}/api/${relationTo}?${searchParams}`,
        )
        const json = await req.json()
        clearTimeout(timer)
        hasHydrated.current = true

        const { docs } = json as { docs: Product[] }

        if (docs && Array.isArray(docs)) {
          setResults(json)
          setIsLoading(false)
          if (typeof onResultChange === 'function') {
            onResultChange(json)
          }
        }
      } catch (err) {
        console.warn(err) // eslint-disable-line no-console
        setIsLoading(false)
        setError(`Unable to load "${relationTo} archive" data at this time.`)
      }
    }

    makeRequest()

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [
    page,
    catsFromProps,
    catsFromQuery,
    relationTo,
    onResultChange,
    sort,
    limit,
    selectedCategory,
  ])

  const router = useRouter()

  return (
    <div className={[classes.collectionArchive, className].filter(Boolean).join(' ')}>
      <div ref={scrollRef} className={classes.scrollRef} />
      {isLoading && <Gutter>Loading, please wait...</Gutter>}
      {!isLoading && error && <Gutter>{error}</Gutter>}
      {!isLoading && (
        <Fragment>
          {catsFromProps.length > 0 && (
            <Gutter>
              <div className={classes.categories}>
                <span
                  className={selectedCategory === null ? classes.activeCategory : classes.category}
                  onClick={() => {
                    router.push(
                      {
                        pathname: router.pathname,
                        query: {
                          ...router.query,
                          categories: undefined,
                        },
                      },
                      undefined,
                      { shallow: true },
                    )
                  }}
                >
                  All
                </span>
                {catsFromProps.map(cat => (
                  <span
                    key={cat.id}
                    className={
                      selectedCategory === cat.id ? classes.activeCategory : classes.category
                    }
                    onClick={() => {
                      setSelectedCategory(cat.id)
                      router.push(
                        {
                          pathname: router.pathname,
                          query: {
                            ...router.query,
                            categories: cat.id,
                          },
                        },
                        undefined,
                        { shallow: true },
                      )
                    }}
                  >
                    {cat.title}
                  </span>
                ))}
              </div>
            </Gutter>
          )}
          {showPageRange !== false && (
            <Gutter>
              <div className={classes.pageRange}>
                <PageRange
                  totalDocs={results.totalDocs}
                  currentPage={results.page}
                  collection={relationTo}
                  limit={limit}
                />
              </div>
            </Gutter>
          )}
          <Gutter>
            <Grid className={classes.grid}>
              {results.docs?.map((result, index) => {
                return (
                  <Cell key={index} className={classes.row} cols={4} colsS={12}>
                    <Card
                      relationTo={relationTo}
                      doc={result}
                      showCategories
                      showDescription={relationTo === 'articles'}
                    />
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
