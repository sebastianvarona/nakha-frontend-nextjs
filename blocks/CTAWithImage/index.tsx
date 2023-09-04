import { Cell, Grid } from '@faceless-ui/css-grid'
import { useInView } from 'framer-motion'
import React, { useRef } from 'react'
import { CMSLink } from '../../components/Link'
import RichText from '../../components/RichText'
import { VerticalPadding } from '../../components/VerticalPadding'
import { Media, Page } from '../../payload-types'
import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'ctaWithImage' }>

export const CTAWithImageBlock: React.FC<
  Props & {
    id?: string
  }
> = ({ title, hasLinks, link, richText, image, imageHasDescription, imageContent, side }) => {
  const img = image as Media

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div className={classes.ctaWithImage}>
      <Grid className={classes.grid}>
        {side === 'left' && (
          <Cell
            cols={6}
            colsM={12}
            ref={ref}
            style={{
              transform: isInView ? 'none' : 'translateX(-200px)',
              opacity: isInView ? 1 : 0,
              transition: 'all 0.6s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s',
            }}
          >
            <div className={classes.imageWrapper}>
              <img src={img.url} alt={img.alt} />
              <div className={classes.imageContent}>
                <RichText className={classes.richText} content={imageContent} />
              </div>
            </div>
          </Cell>
        )}
        <Cell cols={6} colsM={12}>
          <div className={classes.content}>
            <RichText className={classes.richText} content={title} />
            {/* Divider */}
            <div className={classes.divider} />
            <RichText className={classes.richText} content={richText} />
            {hasLinks && (
              <VerticalPadding bottom="none" top="medium">
                <CMSLink {...link} />
              </VerticalPadding>
            )}
          </div>
        </Cell>
        {side === 'right' && (
          <Cell
            cols={6}
            colsM={12}
            ref={ref}
            style={{
              transform: isInView ? 'none' : 'translateX(200px)',
              opacity: isInView ? 1 : 0,
              transition: 'all 0.6s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s',
            }}
          >
            <div className={classes.imageWrapper}>
              <img src={img.url} alt={img.alt} />
              {imageHasDescription && (
                <div className={classes.imageContent}>
                  <RichText className={classes.richText} content={imageContent} />
                </div>
              )}
            </div>
          </Cell>
        )}
      </Grid>
    </div>
  )
}
