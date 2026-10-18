import { agree } from './plural'

/** What the list holds, as its share image and that image's alt text say it */
export const listHeadline = (count: number): string =>
  agree(
    count,
    `Allur ${count} rafbíllinn sem seldur er á Íslandi`,
    `Allir ${count} rafbílarnir sem seldir eru á Íslandi`,
  )
