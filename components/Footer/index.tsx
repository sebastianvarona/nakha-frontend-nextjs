import React from 'react'
import Link from 'next/link'

import { Footer as FooterType } from '../../payload-types'
import { Gutter } from '../Gutter'
import { CMSLink } from '../Link'
import { Logo } from '../Logo'

import classes from './index.module.scss'

export const Footer: React.FC<{ footer: FooterType }> = ({ footer }) => {
  const navItems = footer?.navItems || []

  return (
    <footer className={classes.footer}>
      <Gutter className={classes.wrap}>
        <div className={classes.leftCol}>
          <p className={classes.text}>
            <span className={classes.brand}>
              © {new Date().getFullYear()} <span className={classes.name}>NAKHA ®</span>.
            </span>{' '}
            {footer?.copyright || ''}
          </p>
        </div>
        <div className={classes.logo}>
          <Link href="/">
            <Logo color="white" />
          </Link>
        </div>
        <nav className={classes.nav}>
          {navItems.map(({ link }, i) => {
            return <CMSLink key={i} {...link} />
          })}
        </nav>
      </Gutter>
    </footer>
  )
}
