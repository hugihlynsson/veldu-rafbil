/**
 * Writes modules/data/carChanges.ts: what each change to newCars.ts did to
 * each car, which /uppfaerslur and each car's page tell.
 *
 *   npx tsx scripts/car-changes.ts             what this branch changed, dated today
 *   npx tsx scripts/car-changes.ts --rebuild   the whole log afresh, from the git history
 *
 * A branch's entries are worked out afresh from where it left main on every
 * run, so it can be run again after each edit and dates them all the day of
 * the last. --rebuild dates each change by the commit that brought it to
 * main, and drops any entry edited by hand, and any for a car in
 * `neverListed`.
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import type { CarChange } from '@/modules/data/carChanges'
import newCars from '@/modules/data/newCars'
import { movedSlugs } from '@/modules/data/movedSlugs'
import {
  diffVersions,
  followRenames,
  readVersion,
  withoutNeverListed,
  type CarVersion,
} from './carChangeDiff'

const root = path.join(__dirname, '..')
const dataFile = 'modules/data/newCars.ts'
const logFile = 'modules/data/carChanges.ts'

const git = (...args: string[]) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 1e9 })

const scratch = mkdtempSync(path.join(tmpdir(), 'car-changes-'))

// A version of a file in the history, loaded as the module it was. Its
// imports are of types only, which go when it is compiled, so it loads alone.
const loadAt = async <T>(revision: string, file: string): Promise<T> => {
  const copy = path.join(
    scratch,
    `${revision}-${path.basename(file, '.ts')}.mts`,
  )
  writeFileSync(copy, git('show', `${revision}:${file}`))
  return (await import(pathToFileURL(copy).href)).default as T
}

const versionAt = async (revision: string, file = dataFile) =>
  readVersion(await loadAt<Record<string, unknown>[]>(revision, file))

// The day in Iceland, which keeps UTC all year
const dayOf = (date: Date) => date.toISOString().slice(0, 10)

const working = () =>
  readVersion(newCars as unknown as Record<string, unknown>[])

const rebuild = async (): Promise<CarChange[]> => {
  // --follow finds the data under the paths it had before; it walks newest first
  const log = git(
    'log',
    '--first-parent',
    '--follow',
    '--name-only',
    '--format=@%H %ct',
    '--',
    dataFile,
  )
  const commits = log
    .split(/^@/m)
    .filter(Boolean)
    .map((block) => {
      const [head = '', file = ''] = block.trim().split('\n').filter(Boolean)
      const [hash = '', time = '0'] = head.split(' ')
      return { hash, file, date: dayOf(new Date(Number(time) * 1000)) }
    })
    .reverse()

  let entries: CarChange[] = []
  let before = new Map<string, CarVersion>()
  const apply = (after: Map<string, CarVersion>, date: string) => {
    const diff = diffVersions(before, after, date, movedSlugs)
    entries = [...followRenames(entries, diff.renames), ...diff.entries]
    before = after
  }

  for (const { hash, file, date } of commits) {
    let after: Map<string, CarVersion>
    try {
      after = await versionAt(hash, file)
    } catch {
      // A few commits left the file broken and the next one mended it
      console.warn(`Skipped ${hash.slice(0, 8)}, which does not compile`)
      continue
    }
    apply(after, date)
  }
  apply(working(), dayOf(new Date()))
  return withoutNeverListed(entries)
}

const exists = (name: string) => {
  try {
    git('rev-parse', '--verify', '--quiet', name)
    return true
  } catch {
    return false
  }
}

const isAncestor = (older: string, newer: string) => {
  try {
    git('merge-base', '--is-ancestor', older, newer)
    return true
  } catch {
    return false
  }
}

// The newest main there is. A stale origin/main would put the branch's start
// before changes it already has from main, and those would be logged again as
// this branch's, dated today; so it is fetched first, and a local main that
// is further on still wins.
const mainBranch = () => {
  try {
    git('fetch', '--quiet', 'origin', 'main')
  } catch {
    console.warn('Could not fetch main; working from the copy there is')
  }
  const names = ['origin/main', 'main'].filter(exists)
  const [first, second] = names
  if (!first) throw new Error('No main branch to work out the changes from')
  return second && isAncestor(first, second) ? second : first
}

const sinceMain = async (): Promise<CarChange[]> => {
  const base = git('merge-base', 'HEAD', mainBranch()).trim()
  let logged: CarChange[]
  try {
    logged = await loadAt<CarChange[]>(base, logFile)
  } catch {
    throw new Error(
      `main has no ${logFile} yet: run with --rebuild to write it from the history`,
    )
  }
  const { entries, renames } = diffVersions(
    await versionAt(base),
    working(),
    dayOf(new Date()),
    movedSlugs,
  )
  return [...followRenames(logged, renames), ...entries]
}

const write = (entries: ReadonlyArray<CarChange>) => {
  const file = path.join(root, logFile)
  writeFileSync(
    file,
    `// What each change to newCars.ts did to each car, oldest first. Written by
// scripts/car-changes.ts, and read in the pull request like the data it
// follows, one line to a change. carChanges.test.ts fails while the log,
// read through, does not end at the cars as they are.

export interface CarChange {
  /** The day the change reached the site, in Iceland */
  date: string
  /**
   * The car's slug now, or the last it had if it has left the data; after a
   * ~ and the day it left, if another car has since taken it
   */
  slug: string
  /** What the car was called once the change was made */
  label: string
  /** It went on sale, or back on sale, as it was then: delivery, if any, and price */
  added?: true
  /** It stopped being sold new: marked deprecated, or taken out of the data */
  removed?: true
  /** The list price, before the grant, which changes by its own rules */
  price?: { from?: number; to: number }
  /** When it is expected; none for a car on sale now */
  delivery?: { from?: string; to?: string }
  renamedFrom?: string
  /** Its make and model, once it has left the data and has no page to say */
  name?: string
}

// prettier-ignore
const carChanges: ReadonlyArray<CarChange> = [
${entries.map((entry) => `  ${JSON.stringify(entry)},`).join('\n')}
]

export default carChanges
`,
  )
  execFileSync('npx', ['oxfmt', file], { cwd: root, stdio: 'ignore' })
}

const main = async () => {
  const entries = process.argv.includes('--rebuild')
    ? await rebuild()
    : await sinceMain()
  write(entries)
  console.log(`${entries.length} entries in ${logFile}`)
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => rmSync(scratch, { recursive: true, force: true }))
