// toLocaleString() can differ between node and client and break hydration, so
// the grouping is done here: a dot before every run of three digits that ends
// the number. Prices are whole krónur, and a fraction is left as it came
// rather than grouped into nonsense.
const addDecimalSeparators = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+$)/g, '.')

export default addDecimalSeparators
