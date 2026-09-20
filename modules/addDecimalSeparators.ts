// toLocaleString() can differ between node and client and break hydration
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
