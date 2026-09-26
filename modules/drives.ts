// Apart from the schema so the filters can read it: anything the list imports
// ships in its first load, and zod is most of a hundred kilobytes of it
export const drives = ['AWD', 'FWD', 'RWD'] as const
