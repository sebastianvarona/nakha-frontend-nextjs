import React from 'react'
import { Modal, useModal } from '@faceless-ui/modal'

import { Header } from '../../payload-types'
import { Gutter } from '../Gutter'
import { CMSLink } from '../Link'

import classes from './mobileMenuModal.module.scss'

type Props = {
  navItems: Header['navItems']
}

export const slug = 'menu-modal'

export const MobileMenuModal: React.FC<Props> = ({ navItems }) => {
  const { toggleModal } = useModal()
  return (
    <Modal slug={slug} className={classes.mobileMenuModal}>
      <Gutter>
        <div className={classes.mobileMenuItems}>
          {navItems.map(({ link }, i) => {
            return (
              <div onClick={() => toggleModal('menu-modal')}>
                <CMSLink className={classes.menuItem} key={i} {...link} />
              </div>
            )
          })}
        </div>
      </Gutter>
    </Modal>
  )
}
