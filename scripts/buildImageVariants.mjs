// Pre-renders every hero photo at the widths next.config.js asks for, so the
// browser can be pointed at a static file instead of `/_next/image`. Runs
// before `next build`; the output is generated and git-ignored.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import path from 'node:path'

const require = createRequire(import.meta.url)
const sharp = require('sharp')

const SOURCE = 'public/images'
const OUT = 'public/rendered'
// The hero widths: `imageSizes` belongs to MiniCar's thumbnail, and it reads
// the same files.
const WIDTHS = [128, 256, 540, 828, 1080, 1180, 1320]
const QUALITY = 75

const sources = (await readdir(SOURCE)).filter((f) => f.endsWith('.jpg'))
await mkdir(OUT, { recursive: true })

let written = 0
let reused = 0
let bytes = 0
const started = Date.now()

const manifest = {}

await Promise.all(
  sources.map(async (file) => {
    const name = path.basename(file, '.jpg')
    const buffer = await readFile(path.join(SOURCE, file))
    // Content hash, so replacing a photo changes every URL it is behind and
    // no cache anywhere can hand back the old one.
    const digest = createHash('sha256').update(buffer).digest('hex').slice(0, 8)
    manifest[name] = digest

    await Promise.all(
      WIDTHS.map(async (width) => {
        const out = path.join(OUT, `${name}.${digest}.${width}.webp`)
        if (existsSync(out)) {
          reused += 1
          return
        }
        const data = await sharp(buffer)
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: QUALITY })
          .toBuffer()
        await writeFile(out, data)
        written += 1
        bytes += data.byteLength
      }),
    )
  }),
)

await writeFile(
  'modules/heroImageHashes.json',
  JSON.stringify(manifest, null, 2) + '\n',
)

const seconds = ((Date.now() - started) / 1000).toFixed(1)
console.log(
  `${sources.length} photos x ${WIDTHS.length} widths: ${written} written, ${reused} reused, ` +
    `${(bytes / 1e6).toFixed(1)} MB in ${seconds}s`,
)
