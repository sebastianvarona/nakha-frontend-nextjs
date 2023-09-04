// eslint-disable-next-line simple-import-sort/imports
import React from 'react'

import { Page } from '../../payload-types'

import { Cell, Grid } from '@faceless-ui/css-grid'
import { Gutter } from '../../components/Gutter'
import RichText from '../../components/RichText'
import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'faq' }>

export const FaqItems: React.FC<
  Props & {
    id?: string
  }
> = ({ questions }) => {
  return (
    <Gutter>
      <Grid>
        {questions.map((q, i) => (
          <Cell cols={8} start={3} key={i} className={classes.cell}>
            <RichText content={q.richText} />
          </Cell>
        ))}
      </Grid>
    </Gutter>
  )
}
