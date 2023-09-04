import { MessageField } from 'payload-plugin-form-builder/dist/types'
import React from 'react'
import { Width } from '../Width'

import RichText from '../../../components/RichText'
import classes from './index.module.scss'

export const Message: React.FC<MessageField> = ({ message }) => {
  return (
    <Width width="100">
      <RichText content={message} className={classes.message} />
    </Width>
  )
}
