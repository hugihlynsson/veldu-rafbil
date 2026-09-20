import newCars from './newCars'

// Nothing on the site linked to /api/cars, and this is the vocabulary a crawler
// already reads to find a machine-readable copy of what it is looking at.
//
// The cars themselves are deliberately not marked up. An ItemList of all of
// them costs +88% of the page's transferred weight, because App Router
// serialises the server tree into the HTML for hydration and every byte ships
// twice. The page already renders each car as text, and the typed copy is
// behind this link, built once at deploy rather than sent with every response.
export const buildDatasetSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Rafbílar á Íslandi',
  description: `Allir ${newCars.length} bílarnir sem eru seldir nýir á Íslandi og eru 100% rafdrifnir, með verði eftir styrk, drægni og hleðslutölum.`,
  creator: { '@type': 'Person', name: 'Hugi Hlynsson' },
  inLanguage: 'is',
  isAccessibleForFree: true,
  distribution: [
    {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: '/api/cars',
    },
  ],
})

// A `</script>` in the data would end the block early. Ours has none, but the
// escape costs nothing and the failure would be silent.
export const serialiseSchema = (schema: unknown): string =>
  JSON.stringify(schema).replace(/</g, '\\u003c')
