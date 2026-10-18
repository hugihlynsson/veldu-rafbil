/** Names in a run as Icelandic sets them out: "a, b og c", or "a, b eða c" */
export const listNames = (
  names: ReadonlyArray<string>,
  conjunction: 'og' | 'eða' = 'og',
): string =>
  names.length < 2
    ? names.join('')
    : `${names.slice(0, -1).join(', ')} ${conjunction} ${names.at(-1)}`
