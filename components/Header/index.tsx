import React, { useEffect, useState } from 'react'
import { ModalToggler } from '@faceless-ui/modal'
import Link from 'next/link'

import { Header as HeaderType } from '../../payload-types'
import { useAuth } from '../../providers/Auth'
import { CartLink } from '../CartLink'
import { Gutter } from '../Gutter'
import { MenuIcon } from '../icons/Menu'
import { CMSLink } from '../Link'
import { Logo } from '../Logo'
import { MobileMenuModal, slug as menuModalSlug } from './MobileMenuModal'

import classes from './index.module.scss'

export const Header: React.FC<{ header: HeaderType }> = ({ header }) => {
  const navItems = header?.navItems || []
  const { user } = useAuth()
  const [scrollBackground, setScrollBackground] = React.useState(false)
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    setIsVisible(true)
  }, [])

  React.useEffect(() => {
    const handleScroll = () => {
      // Set the desired scroll position at which you want to change the background
      const scrollThreshold = 200
      const shouldChangeBackground = window.scrollY > scrollThreshold

      setScrollBackground(shouldChangeBackground)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <header
        className={`${classes.header} ${scrollBackground ? classes.scrollBackground : ''} ${
          isVisible ? classes.visible : ''
        }`}
      >
        <Gutter className={classes.wrap}>
          <div className={classes.container}>
            <nav className={classes.nav}>
              {navItems.slice(0, 3).map(({ link }, i) => {
                return <CMSLink key={i} {...link} />
              })}
            </nav>

            <Link href="/" className={classes.logo}>
              <Logo color="white" variant="small" />
            </Link>

            <nav className={`${classes.nav} ${classes.end}`}>
              {navItems.slice(3).map(({ link }, i) => {
                return <CMSLink key={i} className={classes.linkToHide} {...link} />
              })}
              {user && <Link href="/account">Account</Link>}
              {!user && (
                <React.Fragment>
                  <Link href="/login">Login</Link>
                </React.Fragment>
              )}
              <CartLink />
            </nav>
          </div>
          <ModalToggler slug={menuModalSlug} className={classes.mobileMenuToggler}>
            <MenuIcon />
          </ModalToggler>
        </Gutter>
      </header>
      <MobileMenuModal navItems={navItems} />
    </>
  )
}
