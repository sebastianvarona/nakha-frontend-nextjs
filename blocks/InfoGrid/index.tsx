// eslint-disable-next-line simple-import-sort/imports
import { Cell, Grid } from '@faceless-ui/css-grid'
import React from 'react'

import { Media, Page } from '../../payload-types'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'infoGrid' }>

export const InfoGrid: React.FC<
  Props & {
    id?: string
  }
> = ({ infoGrid }) => {
  return (
    <Grid className={classes.infoGrid}>
      {infoGrid.map((info, index) => {
        const { title, description, image } = info
        const img = image as Media
        return (
          <Cell key={index} className={classes.container} cols={3} colsM={6} colsS={12}>
            <div className={classes.imageContainer}>
              <img src={img.url} alt={img.alt} />
            </div>
            <div className={classes.textContainer}>
              <h5 className={classes.title}>{title}</h5>
              <p className={classes.description}>{description}</p>
            </div>
          </Cell>
        )
      })}
    </Grid>
  )
}
