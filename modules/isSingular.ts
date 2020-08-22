const isSingular = (value: number) =>
  value.toString().endsWith('1') && !value.toString().endsWith('11')

export default isSingular
