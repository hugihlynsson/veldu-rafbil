import { FunctionComponent } from 'react'

import { serializeStructuredData } from '@/modules/structuredData'

/** What a page is to a search engine, as schema.org reads it */
const StructuredData: FunctionComponent<{ data: object }> = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: serializeStructuredData(data) }}
  />
)

export default StructuredData
