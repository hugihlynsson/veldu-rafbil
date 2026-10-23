import { connection } from 'next/server'

import List from '../page'

export { metadata } from '../page'

// A URL with a sort or a filter in it, rewritten here from / by next.config.ts,
// so the list arrives in the order and with the cars its URL asks for rather
// than reordering once it hydrates
export default async function Page() {
  await connection()

  return <List />
}
