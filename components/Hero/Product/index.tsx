import React, { Fragment } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Listbox } from '@headlessui/react'
import { set } from 'date-fns'

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
    variants,
    attributes,
    detail,
    meta: { image: metaImage, description },
  } = product

  const [selectedVariant, setSelectedVariant] = React.useState(variants?.[0] || null)

  const [hasDetail, setHasDetail] = React.useState(false)
  const [hasVariants, setHasVariants] = React.useState(false)
  const [hasAttributes, setHasAttributes] = React.useState(false)

  React.useEffect(() => {
    if (detail && detail.length > 0 && detail !== '') {
      setHasDetail(true)
    } else {
      setHasDetail(false)
    }
    if (variants && variants.length > 0) {
      setHasVariants(true)
      setSelectedVariant(variants[0])
    } else {
      setHasVariants(false)
      setSelectedVariant(null)
    }
    if (attributes && attributes.length > 0) {
      setHasAttributes(true)
    } else {
      setHasAttributes(false)
    }
  }, [detail, variants, attributes, product])

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
              {hasDetail && <p className={classes.detail}>{detail}</p>}
              {!hasDetail && description && <p className={classes.description}>{description}</p>}
              {hasAttributes && (
                <ul className={classes.attributes}>
                  {attributes?.map(attribute => {
                    const { id, name, value } = attribute
                    return (
                      <li key={id} className={classes.attribute}>
                        <strong>{name}:</strong> {value}
                      </li>
                    )
                  })}
                </ul>
              )}

              {hasVariants && (
                <div className={classes.variant}>
                  <h5 className={classes.variantTitle}>Variant:</h5>
                  <div className={classes.selectParent}>
                    <select
                      className={classes.select}
                      onChange={e => {
                        const selected = variants?.find(variant => variant.name === e.target.value)
                        setSelectedVariant(selected)
                      }}
                    >
                      {variants?.map(variant => {
                        const { id, name } = variant
                        return (
                          <option key={id} value={name}>
                            {name}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </div>
              )}

              <Price product={product} button={false} />
              <AddToCartButton
                product={product}
                variant={selectedVariant?.name}
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
