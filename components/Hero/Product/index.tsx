import React, { Fragment } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'

import { Product } from '../../../payload-types'
import { AddToCartButton } from '../../AddToCartButton'
import { Gutter } from '../../Gutter'
import { Media } from '../../Media'
import { Price } from '../../Price'
import RichText from '../../RichText'
import { VerticalPadding } from '../../VerticalPadding'

import classes from './index.module.scss'

export const ProductHero: React.FC<{
  product: Product
}> = ({ product }) => {
  const {
    title,
    categories,
    meta: { image: metaImage, description },
  } = product

  return (
    <VerticalPadding top="large">
      <Gutter className={classes.productHero}>
        <Grid>
          <Cell cols={6} colsS={12}>
            <div className={classes.mediaContainer}>
              <div className={classes.mediaWrapper}>
                {!metaImage && <div className={classes.placeholder}>No image</div>}
                <div className={classes.overlay} />
                {metaImage && typeof metaImage !== 'string' && (
                  <Media imgClassName={classes.image} resource={metaImage} fill />
                )}
              </div>
              {metaImage && typeof metaImage !== 'string' && metaImage?.caption && (
                <RichText content={metaImage.caption} />
              )}
            </div>
          </Cell>
          <Cell cols={6} colsS={12}>
            <div className={classes.content}>
              <div className={classes.categories}>
                {categories?.map((category, index) => {
                  const { title: categoryTitle } = category

                  const titleToUse = categoryTitle || 'Untitled category'

                  const isLast = index === categories.length - 1

                  return (
                    <Fragment key={index}>
                      {titleToUse}
                      {!isLast && <Fragment>, &nbsp;</Fragment>}
                    </Fragment>
                  )
                })}
              </div>
              <h1 className={classes.title}>{title}</h1>
              {description && <p className={classes.description}>{description}</p>}
              <Price product={product} button={false} />
              <AddToCartButton
                product={product}
                className={classes.addToCartButton}
                appearance="primary"
              />
            </div>
          </Cell>
        </Grid>
      </Gutter>
    </VerticalPadding>
  )
}
