// From https://gist.github.com/fsufitch/18bb4692d5f46b649890f8fd58765fbc
// See https://medium.com/@fsufitch/is-javascript-array-sort-stable-46b90822543f

interface Comparator<T> {
  (a: T, b: T): number
}

let defaultCmp: Comparator<any> = (a, b) => {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

export default function stableSort<T>(
  items: Array<T>,
  cmp: Comparator<T> = defaultCmp,
): T[] {
  const clonedItems = [...items]
  let stabilized = clonedItems.map<[T, number]>((el, index) => [el, index])
  let stableCmp: Comparator<[T, number]> = (a, b) => {
    let order = cmp(a[0], b[0])
    if (order != 0) return order
    return a[1] - b[1]
  }

  stabilized.sort(stableCmp)
  for (let i = 0; i < clonedItems.length; i++) {
    clonedItems[i] = stabilized[i][0]
  }

  return clonedItems
}
