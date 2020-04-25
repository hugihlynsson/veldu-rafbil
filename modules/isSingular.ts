export default (value: number) =>
  value.toString().endsWith('1') && !value.toString().endsWith('11')
