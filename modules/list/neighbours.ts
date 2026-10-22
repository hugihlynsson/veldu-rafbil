/** The cars either side of one in the list as it is shown, if it is there */
export const neighboursOf = <T extends { id: string }>(
  list: ReadonlyArray<T>,
  car: T,
): { previous?: T; next?: T } => {
  const index = list.findIndex((other) => other.id === car.id)
  if (index === -1) return {}
  return { previous: list[index - 1], next: list[index + 1] }
}
