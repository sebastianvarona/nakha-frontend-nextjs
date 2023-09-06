import React, { useEffect, useState } from 'react'

import { Page } from '../../../payload-types'
import { CMSLink } from '../../Link'
import { Media } from '../../Media'
import RichText from '../../RichText'
import { VerticalPadding } from '../../VerticalPadding/index'

import classes from './index.module.scss'

export const MediumImpactHero: React.FC<Page['hero']> = ({ richText, media, links }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className={`${classes.hero} ${isVisible ? classes.visible : ''}`}>
      <div id="heroMedia" className={classes.media}>
        <video src="/backgrounds/video_banner.mp4" className={classes.video} autoPlay loop muted />
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
}
