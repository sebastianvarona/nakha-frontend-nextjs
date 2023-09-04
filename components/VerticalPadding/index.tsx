import React from 'react'

import classes from './index.module.scss'

export type VerticalPaddingOptions = 'large' | 'medium' | 'none' | 'header'

type Props = {
  top?: VerticalPaddingOptions
  bottom?: VerticalPaddingOptions
  children: React.ReactNode
  className?: string
  header?: VerticalPaddingOptions
}

export const VerticalPadding: React.FC<Props> = ({
  top = 'medium',
  bottom = 'medium',
  className,
  children,
}) => {
  return (
    <div
      className={[className, classes[`top-${top}`], classes[`bottom-${bottom}`], classes.header]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
