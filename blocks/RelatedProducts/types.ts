import type { Page } from '../../payload-types'

export type RelatedProductsProps = Extract<Page['layout'][0], { blockType: 'relatedProducts' }>
