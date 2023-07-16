import React, { Fragment } from 'react'

import { ArchiveBlock } from '../../blocks/ArchiveBlock'
import { CTAWithImageBlock } from '../../blocks/CTAWithImage/index'
import { CallToActionBlock } from '../../blocks/CallToAction'
import { ContentBlock } from '../../blocks/Content'
import { FeaturedProducts } from '../../blocks/FeaturedProducts/index'
import { ImageContentCollageBlock } from '../../blocks/ImageContentCollage'
import { InfoGrid } from '../../blocks/InfoGrid'
import { MediaBlock } from '../../blocks/MediaBlock'
import { Page } from '../../payload-types'
import { toKebabCase } from '../../utilities/toKebabCase'
import { VerticalPadding, VerticalPaddingOptions } from '../VerticalPadding'

const blockComponents = {
  cta: CallToActionBlock,
  content: ContentBlock,
  mediaBlock: MediaBlock,
  imageContentCollage: ImageContentCollageBlock,
  archive: ArchiveBlock,
  ctaWithImage: CTAWithImageBlock,
  infoGrid: InfoGrid,
  featuredProducts: FeaturedProducts,
}

export const Blocks: React.FC<{
  blocks: Page['layout']
  disableTopPadding?: boolean
}> = props => {
  const { disableTopPadding, blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            let paddingTop: VerticalPaddingOptions = 'medium'
            let paddingBottom: VerticalPaddingOptions = 'medium'

            if (index === blocks.length - 1) {
              paddingBottom = 'medium'
            }

            if (disableTopPadding && index === 0) {
              paddingTop = 'none'
            }

            if (!disableTopPadding && index === 0) {
              paddingTop = 'medium'
            }

            if (Block) {
              return (
                <VerticalPadding top={paddingTop} bottom={paddingBottom}>
                  {/* @ts-ignore */}
                  <Block
                    // @ts-ignore
                    id={toKebabCase(blockName)}
                    {...block}
                  />
                </VerticalPadding>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
