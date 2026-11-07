// A photo that is the thing to click zooms on hover within a frame that clips
// it, so the frame needs overflow-hidden and the link around it `group`. The
// zoom eases in over 500ms and back in 300ms, as a slow return lingers after
// the pointer has gone. A row that fills on hover, or a card that lifts, leaves
// its photo still
export const photoZoom =
  'motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover:scale-105 motion-safe:group-hover:duration-500'

// For a card that is a row with a thumbnail under md, which fills instead,
// and a tile with its photo on top from md
export const photoZoomFromMd =
  'md:motion-safe:transition-transform md:motion-safe:duration-300 md:motion-safe:ease-out md:group-hover:scale-105 md:motion-safe:group-hover:duration-500'
