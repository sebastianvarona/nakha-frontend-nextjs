import React, { useEffect, useState } from 'react'

import { Page } from '../../../payload-types'
import { Gutter } from '../../Gutter'
import RichText from '../../RichText'
import { VerticalPadding } from '../../VerticalPadding'

import classes from './index.module.scss'

export const LowImpactHero: React.FC<Page['hero']> = ({ richText }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <Gutter>
      <VerticalPadding
        top="large"
        bottom="none"
        className={`${classes.lowImpactHero} ${isVisible ? classes.visible : ''}`}
      >
        <RichText className={classes.richText} content={richText} />
      </VerticalPadding>
    </Gutter>
  )
}
