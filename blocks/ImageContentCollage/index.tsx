import { Cell, Grid } from '@faceless-ui/css-grid'
import { FC, useRef } from 'react'
import RichText from '../../components/RichText'
import { VerticalPadding } from '../../components/VerticalPadding'
import { Media, Page } from '../../payload-types'

import { useInView } from 'framer-motion'
import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'imageContentCollage' }>

export const ImageContentCollageBlock: FC<
  Props & {
    id?: string
  }
> = ({ richText, images }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <>
      <VerticalPadding top="medium" bottom="none">
        <Grid>
          <Cell cols={8} colsM={12} start={3}>
            <div className={classes.content}>
              <RichText className={classes.richText} content={richText} />
            </div>
          </Cell>
        </Grid>
      </VerticalPadding>
      <VerticalPadding top="large" bottom="none">
        <Grid ref={ref}>
          {images.map(({ image }, i) => {
            const { url, alt } = image as Media

            return (
              <Cell key={i} cols={4} colsM={12} className={classes.imageCell}>
                <div className={classes.imageContainer}>
                  <img
                    src={url}
                    alt={alt}
                    style={{
                      transform: isInView ? 'none' : 'translateY(-100px)',
                      opacity: isInView ? 1 : 0,
                      transition: `all 0.6s cubic-bezier(0.17, 0.55, 0.55, 1) ${0.25 + i / 2}s`,
                    }}
                  />
                </div>
              </Cell>
            )
          })}
        </Grid>
      </VerticalPadding>
    </>
  )
}
