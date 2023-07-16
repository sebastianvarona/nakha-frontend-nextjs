import type { Page } from '../../payload-types'

export type FeaturedProductsProps = Extract<Page['layout'][0], { blockType: 'featuredProducts' }>
