import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { brotliDecompressSync } from 'node:zlib'
import { describe, expect, it } from 'vitest'

const root = path.join(__dirname, '../..')

const readBase128 = (bytes: Buffer, at: number): [number, number] => {
  let value = 0
  for (let i = 0; i < 5; i++) {
    value = value * 128 + (bytes[at + i] & 0x7f)
    if (!(bytes[at + i] & 0x80)) return [value, at + i + 1]
  }
  throw new Error('Bad UIntBase128')
}

/** The cmap table of a WOFF2 font, which WOFF2 stores untransformed */
const woff2Cmap = (woff2: Buffer): Buffer => {
  const numTables = woff2.readUInt16BE(12)
  const compressedLength = woff2.readUInt32BE(20)
  const lengths: number[] = []
  let cmapIndex = -1
  let at = 48

  for (let i = 0; i < numTables; i++) {
    const flags = woff2[at++]
    const known = flags & 0x3f
    if (known === 0) cmapIndex = i
    if (known === 0x3f) at += 4
    const transformed =
      known === 10 || known === 11 ? flags >> 6 === 0 : flags >> 6 !== 0
    let [length, next] = readBase128(woff2, at)
    if (transformed) [length, next] = readBase128(woff2, next)
    lengths.push(length)
    at = next
  }

  const data = brotliDecompressSync(woff2.subarray(at, at + compressedLength))
  const offset = lengths.slice(0, cmapIndex).reduce((sum, l) => sum + l, 0)
  return data.subarray(offset, offset + lengths[cmapIndex])
}

/** Every code point the Windows BMP subtable (format 4) maps to a glyph */
const codePoints = (cmap: Buffer): Set<number> => {
  let subtable = -1
  for (let i = 0; i < cmap.readUInt16BE(2); i++) {
    const record = 4 + i * 8
    if (cmap.readUInt16BE(record) === 3 && cmap.readUInt16BE(record + 2) === 1)
      subtable = cmap.readUInt32BE(record + 4)
  }
  if (cmap.readUInt16BE(subtable) !== 4) throw new Error('No format 4 cmap')

  const segments = cmap.readUInt16BE(subtable + 6) / 2
  const ends = subtable + 14
  const starts = ends + segments * 2 + 2
  const deltas = starts + segments * 2
  const rangeOffsets = deltas + segments * 2
  const mapped = new Set<number>()

  for (let s = 0; s < segments; s++) {
    const start = cmap.readUInt16BE(starts + s * 2)
    const end = cmap.readUInt16BE(ends + s * 2)
    const delta = cmap.readUInt16BE(deltas + s * 2)
    const rangeOffset = cmap.readUInt16BE(rangeOffsets + s * 2)

    for (let c = start; c <= end && c !== 0xffff; c++) {
      const indexed = rangeOffset
        ? cmap.readUInt16BE(
            rangeOffsets + s * 2 + rangeOffset + (c - start) * 2,
          )
        : c
      const glyph = rangeOffset && !indexed ? 0 : (indexed + delta) % 0x10000
      if (glyph !== 0) mapped.add(c)
    }
  }
  return mapped
}

const read = (folder: string, extension: RegExp) =>
  readdirSync(path.join(root, folder), { recursive: true, encoding: 'utf8' })
    .filter((file) => extension.test(file))
    .map((file) => ({
      file: path.join(folder, file),
      source: readFileSync(path.join(root, folder, file), 'utf8'),
    }))

const layout = readFileSync(path.join(root, 'app/layout.tsx'), 'utf8')
const fontFile = layout.match(/src: '\.\/(fonts\/[^']+\.woff2)'/)?.[1] ?? ''

// The font is cut to a character set, and a character outside it renders in
// the system font, mid-word, with nothing to say so
describe('the font layout.tsx loads', () => {
  const covered = codePoints(
    woff2Cmap(readFileSync(path.join(root, 'app', fontFile))),
  )
  const missing = (text: string) =>
    [...new Set(text)].filter(
      (c) => c > '\x7f' && !covered.has(c.codePointAt(0)!),
    )

  it('is read', () => {
    expect(covered.size).toBeGreaterThan(300)
    expect(covered.has('A'.codePointAt(0)!)).toBe(true)
  })

  it.each([
    'áðéíóúýþæö',
    'ÁÐÉÍÓÚÝÞÆÖ',
    'ŠšČčŽžŁłŐő',
    '„“”‘’–—…•·',
    '×°€%≈≤≥−',
    '↑↓↗→←',
  ])('covers %s', (characters) => {
    expect(missing(characters)).toEqual([])
  })

  it('covers every character in the source and the car data', () => {
    const uncovered = ['app', 'components', 'modules', 'utils']
      .flatMap((folder) => read(folder, /\.(tsx?|css)$/))
      .flatMap(({ file, source }) =>
        missing(source).map((character) => `${character} in ${file}`),
      )
    expect(uncovered).toEqual([])
  })

  // The cut keeps only the features that shape text
  it('is asked for no feature it has dropped', () => {
    const asking = [...read('components', /\.tsx$/), ...read('app', /\.css$/)]
      .filter(({ source }) =>
        /\b(?:tabular|proportional|oldstyle|lining)-nums\b|\b(?:ordinal|slashed-zero|diagonal-fractions|stacked-fractions)\b|'(?:tnum|zero|frac|ss\d\d|cv\d\d)'/.test(
          source,
        ),
      )
      .map(({ file }) => file)
    expect(asking).toEqual([])
  })
})
