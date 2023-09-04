import React from 'react'

import { Gutter } from '../../components/Gutter'
import RichText from '../../components/RichText'
import { FeaturedProductsProps } from './types'

import { Cell, Grid } from '@faceless-ui/css-grid'
import { Card } from '../../components/Card'
import classes from './index.module.scss'

export const FeaturedProducts: React.FC<
  FeaturedProductsProps & {
    id?: string
  }
> = props => {
  const { id, title, selectedProducts } = props

  return (
    <div id={`block-${id}`} className={classes.FeaturedProducts}>
      <Gutter className={classes.introContent}>
        <RichText content={title} />
      </Gutter>
      <Gutter>
        <Grid className={classes.grid}>
          {selectedProducts?.map((product, index) => {
            return (
              <Cell key={index} className={classes.row} cols={4} colsM={8}>
                <Card relationTo={'products'} doc={product.value} showDescription={false} />
              </Cell>
            )
          })}
        </Grid>
      </Gutter>
    </div>
  )
}
