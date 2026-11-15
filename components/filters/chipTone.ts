// The two looks a chip above the list takes, shared by the makes, the filters
// applied and the search button beside them, so what is on reads alike in all
// three. An inset ring rather than a border, so switching one on or off does
// not change its size and shift the row. The type's colour is left to each,
// as a filter's label is quieter than a make.

/**
 * A make chosen, a filter applied: lifted, as the sorting chosen above them
 * is, so the header has one look for what is on
 */
export const chipOn = 'bg-raised shadow-(--shadow-raised)'

/** A make not chosen, or a button among the chips */
export const chipOff =
  'bg-chip-off ring-1 ring-inset ring-line-soft hover:bg-cloud'
