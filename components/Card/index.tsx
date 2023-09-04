import React, { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'

import { Media } from '../Media'
import { Price } from '../Price'

import classes from './index.module.scss'

const priceFromJSON = (priceJSON): string => {
  let price = ''

  if (priceJSON) {
    try {
      const parsed = JSON.parse(priceJSON)?.data[0]
      const priceValue = parsed.unit_amount
      const priceType = parsed.type
      price = `${parsed.currency === 'usd' ? '$' : ''}${(priceValue / 100).toFixed(2)}`
      if (priceType === 'recurring') {
        price += `/${
          parsed.recurring.interval_count > 1
            ? `${parsed.recurring.interval_count} ${parsed.recurring.interval}`
            : parsed.recurring.interval
        }`
      }
    } catch (e) {
      console.error(`Cannot parse priceJSON`) // eslint-disable-line no-console
    }
  }

  return price
}

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  showCategories?: boolean
  showDescription?: boolean
  hideImagesOnMobile?: boolean
  title?: string
  relationTo?: 'products' | 'articles'
  doc?: any
}> = props => {
  const {
    showCategories,
    showDescription,
    relationTo,
    title: titleFromProps,
    doc,
    doc: { slug, title, categories, meta, priceJSON, layout } = {},
    className,
  } = props

  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  const [
    price, // eslint-disable-line no-unused-vars
    setPrice,
  ] = useState(() => priceFromJSON(priceJSON))

  useEffect(() => {
    setPrice(priceFromJSON(priceJSON))
  }, [priceJSON])

  if (relationTo === 'products') {
    // * Products

    return (
      <div className={[classes.card, className].filter(Boolean).join(' ')}>
        <Link href={href} className={`${classes.mediaWrapper} ${classes.mediaProductWrapper}`}>
          <div className={classes.overlay} />
          {!metaImage && <div className={classes.placeholder}>No image</div>}
          {metaImage && typeof metaImage !== 'string' && (
            <Media imgClassName={classes.image} resource={metaImage} fill />
          )}
        </Link>
        {showCategories && hasCategories && (
          <div className={classes.leader}>
            {showCategories && hasCategories && (
              <div className={classes.category}>
                {categories?.map((category, index) => {
                  const { title: titleFromCategory } = category

                  const categoryTitle = titleFromCategory || 'Untitled category'

                  const isLast = index === categories.length - 1

                  return (
                    <Fragment key={index}>
                      {categoryTitle}
                      {!isLast && <Fragment>, &nbsp;</Fragment>}
                    </Fragment>
                  )
                })}
              </div>
            )}
          </div>
        )}
        {titleToUse && (
          <h4 className={classes.productTitle}>
            <Link href={href} className={classes.link}>
              {titleToUse}
            </Link>
          </h4>
        )}
        {showDescription && description && (
          <div className={classes.body}>
            {description && <p className={classes.description}>{sanitizedDescription}</p>}
          </div>
        )}
        {relationTo === 'products' && <Price product={doc} />}
      </div>
    )
  } else {
    // * Articles
    const { description, image: metaImage } = meta || {}

    return (
      <div className={[classes.card, className].filter(Boolean).join(' ')}>
        <Link href={href} className={`${classes.mediaWrapper} ${classes.mediaArticleWrapper}`}>
          {!metaImage && <div className={classes.placeholder}>No image</div>}
          {metaImage && typeof metaImage !== 'string' && (
            <Media imgClassName={classes.image} resource={metaImage} fill />
          )}
        </Link>
        {titleToUse && (
          <h4 className={[classes.articleTitle, classes.alignLeft].join(' ')}>
            <Link href={href} className={classes.link}>
              {titleToUse}
            </Link>
          </h4>
        )}
        {showDescription && description && (
          <div className={classes.body}>
            {description && <p className={classes.description}>{sanitizedDescription}</p>}
          </div>
        )}
      </div>
    )
  }
}
