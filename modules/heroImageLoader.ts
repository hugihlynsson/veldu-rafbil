import hashes from './heroImageHashes.json'

// The widths `scripts/buildImageVariants.mjs` renders, ascending.
const RENDERED = [128, 256, 540, 828, 1080, 1180, 1320]

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

  // A photo with no rendered variant would 404 silently; the source still
  // resolves, so fall back to it rather than to nothing.
  if (!hash) return src

  const rendered = RENDERED.find((w) => w >= width) ?? RENDERED.at(-1)
  return `/rendered/${name}.${hash}.${rendered}.webp`
}
