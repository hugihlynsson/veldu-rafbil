import { describe, expect, it } from 'vitest'

import { SITE_URL } from './siteUrl'
import { breadcrumbList, serializeStructuredData } from './structuredData'

describe('serializeStructuredData', () => {
  it('cannot close the script tag it is written into', () => {
    const json = serializeStructuredData({ name: '</script><script>alert(1)' })
    expect(json).not.toContain('</script>')
    expect(JSON.parse(json)).toEqual({ name: '</script><script>alert(1)' })
  })
})

describe('breadcrumbList', () => {
  it('starts at the front page and counts from one, each step in full', () => {
    const { itemListElement } = breadcrumbList([
      { name: 'Uppfærslur', path: '/uppfaerslur' },
    ])
    expect(itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Veldu Rafbíl',
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Uppfærslur',
        item: `${SITE_URL}/uppfaerslur`,
      },
    ])
  })
})
