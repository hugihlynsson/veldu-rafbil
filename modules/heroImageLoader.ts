import hashes from './heroImageHashes.json'
import widths from './heroImageWidths.json'

// Shared with the render script, and pinned to next.config.js by a test: a
// width the config asks for but nothing renders is served silently small.
const RENDERED: Array<number> = widths

/**
 * Points `next/image` at a file rendered at build time instead of at
 * `/_next/image`. The photos are a fixed set that never changes per request,
 * so there is nothing for a per-request optimiser to earn, and a static file
 * costs nothing on the image-optimisation bill.
 *
 * The hash in the name is the source photo's, so replacing a photo changes
 * every URL behind it — which is the only way to retire a cached image, the
 * optimiser having no invalidation of its own.
 */
export default function heroImageLoader({
  src,
  width,
}: {
  src: string
  width: number
}): string {
  const name = src.replace(/^\/images\//, '').replace(/\.jpg$/, '')
  const hash = (hashes as Record<string, string>)[name]

  // Nothing is served under `/images/` — the sources live in `assets/` — so
  // this 404s rather than recovering. It is the loud failure on purpose: the
  // data test and the one beside this file both fail first, and a broken photo
  // is easier to notice than a silently wrong one.
  if (!hash) return src

  const rendered = RENDERED.find((w) => w >= width) ?? RENDERED.at(-1)
  return `/rendered/${name}.${hash}.${rendered}.webp`
}
