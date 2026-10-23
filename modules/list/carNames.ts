// Read by filters.ts, which next.config.ts loads, so nothing here may import
// the car data or anything with an @/ path

/**
 * Lower case without accents, þ, æ or ð, so "sæti", "saeti" and "Sæti" read
 * alike. People type Icelandic on keyboards without the letters, and the
 * patterns that read them are written against this form only.
 */
export const foldText = (text: string): string =>
  text
    .toLowerCase()
    .replace(/þ/g, 'th')
    .replace(/æ/g, 'ae')
    .replace(/ð/g, 'd')
    .normalize('NFKD')
    .replace(/\p{Mark}/gu, '')

/** What people call a make other than its name, folded */
export const makeAliases: Record<string, string[]> = {
  'Mercedes-Benz': ['mercedes', 'benz', 'merc'],
  Volkswagen: ['vw', 'folksvagen'],
  'Range Rover': ['land rover'],
}

const nameWords = (text: string) =>
  foldText(text)
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)

// "vw id4" is a name the label can hold, "volkswagen id4"
const withMakes = (words: string[]) => {
  let typed = ` ${words.join(' ')} `
  for (const [make, aliases] of Object.entries(makeAliases)) {
    // "mercedes" and "benz" are each an alias, and together the make itself
    const full = ` ${nameWords(make).join(' ')} `
    for (const alias of aliases) {
      if (!typed.includes(full)) typed = typed.replace(` ${alias} `, full)
    }
  }
  return typed.trim().split(' ').filter(Boolean)
}

/**
 * Whether a typed name finds a car's label. Spaces and punctuation are left
 * out, as "X peng" and "ID 4" are how people type XPENG and ID.4, and so is a
 * word of the label left out, as "tesla y" is the Tesla Model Y: each typed
 * word has to start a word of the label, in the label's order.
 */
export const nameMatcher = (name: string) => {
  const typed = withMakes(nameWords(name))
  const squeezed = typed.join('')
  if (!squeezed) return () => false
  return (label: string) => {
    const words = nameWords(label)
    if (words.join('').includes(squeezed)) return true
    let from = 0
    for (const word of typed) {
      const at = words.findIndex((w, i) => i >= from && w.startsWith(word))
      if (at === -1) return false
      from = at + 1
    }
    return true
  }
}

/**
 * A name typed as "Byd kia Tesla" asks for three makes, and as one name it
 * matches no car, so it is cut before each make it names after the first.
 */
export const splitAtMakes = (
  names: ReadonlyArray<string>,
  makes: ReadonlyArray<string>,
): string[] => {
  const makeWords = makes
    .flatMap((make) => [make, ...(makeAliases[make] ?? [])])
    .map((make) => foldText(make).split(/\s+/))
  return names.flatMap((name) => {
    const words = name.split(/\s+/).filter(Boolean)
    const groups: string[][] = []
    for (const [index, word] of words.entries()) {
      const startsMake = makeWords.some((make) =>
        make.every((part, i) => {
          const typed = words[index + i]
          return typed !== undefined && foldText(typed) === part
        }),
      )
      const group = groups.at(-1)
      if (!group || startsMake) groups.push([word])
      else group.push(word)
    }
    return groups.map((group) => group.join(' '))
  })
}
