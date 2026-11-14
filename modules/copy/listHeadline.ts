import { agree } from './plural'

/** What the list holds, as its share image and that image's alt text say it */
export const listHeadline = (count: number): string =>
  agree(
    count,
    `Allur ${count} rafbíllinn sem seldur er á Íslandi`,
    `Allir ${count} rafbílarnir sem seldir eru á Íslandi`,
  )

/** What the list holds, as the intro and the page description open */
export const listLead = (count: number): string =>
  agree(
    count,
    `Allur ${count} rafbíllinn sem seldur er nýr á Íslandi`,
    `Allir ${count} rafbílarnir sem seldir eru nýir á Íslandi`,
  )
