import React, { Fragment, useEffect, useState } from 'react'

import { Page } from '../../../payload-types'
import { CMSLink } from '../../Link'
import { Media } from '../../Media'
import RichText from '../../RichText'
import { VerticalPadding } from '../../VerticalPadding/index'

import classes from './index.module.scss'

export const HighImpactHero: React.FC<Page['hero']> = ({ richText, media, links }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className={`${classes.hero} ${isVisible ? classes.visible : ''}`}>
      <div className={classes.media}>
        {typeof media === 'object' && (
          <Fragment>
            <Media
              resource={media}
              // fill
              className={classes.media}
              imgClassName={classes.image}
              videoClassName={classes.video}
            />
            {media?.caption && <RichText content={media.caption} className={classes.caption} />}
          </Fragment>
        )}
      </div>
      <div className={classes.overlay} />
      <div className={classes.content}>
        <RichText content={richText} />
        <VerticalPadding>
          {Array.isArray(links) && links.length > 0 && (
            <ul className={classes.links}>
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </VerticalPadding>
      </div>
    </section>
  )
  // return (
  //   <Gutter className={classes.hero}>
  //     <Grid className={classes.content}>
  //       <Cell cols={10} colsM={4}>
  //         <RichText content={richText} />
  //         {Array.isArray(links) && links.length > 0 && (
  //           <ul className={classes.links}>
  //             {links.map(({ link }, i) => {
  //               return (
  //                 <li key={i}>
  //                   <CMSLink {...link} />
  //                 </li>
  //               )
  //             })}
  //           </ul>
  //         )}
  //       </Cell>
  //     </Grid>
  //     <div className={classes.media}>
  //       {typeof media === 'object' && (
  //         <Fragment>
  //           <Media
  //             resource={media}
  //             // fill
  //             imgClassName={classes.image}
  //           />
  //           {media?.caption && <RichText content={media.caption} className={classes.caption} />}
  //         </Fragment>
  //       )}
  //     </div>
  //   </Gutter>
  // )
}
