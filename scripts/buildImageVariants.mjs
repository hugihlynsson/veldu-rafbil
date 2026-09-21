// Pre-renders every hero photo in `assets/` at the widths next.config.js asks
// for and writes them into `public/`, so the browser can be pointed at a static
// file instead of `/_next/image`. Runs before `next build`; the output is
// generated and git-ignored.
//
// The sources are the only copy of a photo that is not served: nothing reads
// them at runtime, so they stay out of `public/` and off the deployment.
//
// Rendering happens in `.next/cache`, which Vercel carries between builds, and
// the results are copied into `public/` from there. Rendering straight into
// `public/` would redo all 180 photos on every deploy, since nothing under it
// is cached.
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import path from 'node:path'

const require = createRequire(import.meta.url)
const sharp = require('sharp')

const SOURCE = 'assets/images'
const CACHE = '.next/cache/hero-variants'
const OUT = 'public/rendered'
// Shared with the loader so the two cannot drift; a test pins both to the
// widths next.config.js asks for.
const WIDTHS = JSON.parse(
  await readFile('modules/heroImageWidths.json', 'utf8'),
)
const QUALITY = 75

const started = Date.now()
const sources = (await readdir(SOURCE)).filter((file) => file.endsWith('.jpg'))

await mkdir(CACHE, { recursive: true })
await rm(OUT, { recursive: true, force: true })
await mkdir(OUT, { recursive: true })

const manifest = {}
const wanted = new Set()
let rendered = 0

await Promise.all(
  sources.map(async (file) => {
    const name = path.basename(file, '.jpg')
    const source = await readFile(path.join(SOURCE, file))
    // Content hash, so replacing a photo changes every URL it is behind and
    // no cache anywhere can hand back the old one.
    const digest = createHash('sha256').update(source).digest('hex').slice(0, 8)
    manifest[name] = digest

    await Promise.all(
      WIDTHS.map(async (width) => {
        const variant = `${name}.${digest}.${width}.webp`
        wanted.add(variant)

        if (!existsSync(path.join(CACHE, variant))) {
          const data = await sharp(source)
            .resize({ width, withoutEnlargement: true })
            .webp({ quality: QUALITY })
            .toBuffer()
          await writeFile(path.join(CACHE, variant), data)
          rendered += 1
        }

        await copyFile(path.join(CACHE, variant), path.join(OUT, variant))
      }),
    )
  }),
)

// A photo that changed leaves its old widths behind, and the cache is carried
// between builds, so it would grow without this.
const stale = (await readdir(CACHE)).filter((file) => !wanted.has(file))
await Promise.all(stale.map((file) => rm(path.join(CACHE, file))))

await writeFile(
  'modules/heroImageHashes.json',
  JSON.stringify(manifest, null, 2) + '\n',
)

console.log(
  `${sources.length} photos x ${WIDTHS.length} widths: ${rendered} rendered, ` +
    `${wanted.size - rendered} from cache, ${stale.length} stale dropped ` +
    `(${((Date.now() - started) / 1000).toFixed(1)}s)`,
)
