import { SITE_URL } from './siteUrl'

// A car's name in the data can carry anything, and a </script> in it would
// end the tag the page writes this into
export const serializeStructuredData = (data: object): string =>
  JSON.stringify(data).replace(/</g, '\\u003c')

/** The site as the author and publisher of what it writes */
export const siteOrganization = {
  '@type': 'Organization',
  name: 'Veldu Rafbíl',
  url: `${SITE_URL}/`,
} as const

/** Where a page sits under the site, from the front page down to it */
export const breadcrumbList = (
  trail: ReadonlyArray<{ name: string; path: string }>,
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Veldu Rafbíl', path: '/' }, ...trail].map(
    ({ name, path }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: `${SITE_URL}${path}`,
    }),
  ),
})
