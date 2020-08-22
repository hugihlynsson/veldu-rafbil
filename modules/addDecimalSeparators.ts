// number.toLocaleString() can be inconsistent between node and client, breaking SSR
const addDecimalSeparators = (value: number): string =>
  value
    .toString()
    .split('')
    .reverse()
    .join('')
    .match(/.{1,3}/g)!
    .join('.')
    .split('')
    .reverse()
    .join('')

export default addDecimalSeparators
