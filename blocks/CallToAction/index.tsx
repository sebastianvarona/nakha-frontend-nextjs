// eslint-disable-next-line simple-import-sort/imports
import { Cell, Grid } from '@faceless-ui/css-grid'
import { FC } from 'react'

import { Gutter } from '../../components/Gutter'
import { CMSLink } from '../../components/Link'
import RichText from '../../components/RichText'
import { VerticalPadding } from '../../components/VerticalPadding'
import { Page } from '../../payload-types'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'cta' }>

export const CallToActionBlock: FC<
  Props & {
    id?: string
  }
> = ({ links, richText }) => {
  return (
    <Gutter>
      <VerticalPadding className={classes.callToAction}>
        <Grid>
          <Cell cols={8} colsL={7} colsM={12}>
            <div>
              <RichText className={classes.richText} content={richText} />
            </div>
          </Cell>
          <Cell start={10} cols={3} startL={9} colsL={4} startM={1} colsM={12}>
            <div className={classes.linkGroup}>
              {(links || []).map(({ link }, i) => {
                return <CMSLink key={i} {...link} />
              })}
            </div>
          </Cell>
        </Grid>
      </VerticalPadding>
    </Gutter>
  )
}
