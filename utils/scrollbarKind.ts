/**
 * Marks <html> with whether this system's scrollbars take up room or float
 * and fade, which CSS cannot ask. Measured on each call, since a Mac switches
 * between the two when a mouse is plugged in.
 */
const markScrollbarKind = () => {
  const probe = document.createElement('div')
  probe.style.cssText =
    'position:absolute;top:-9999px;width:100px;height:100px;overflow:scroll'
  document.body.append(probe)
  const takesRoom = probe.offsetWidth > probe.clientWidth
  probe.remove()
  document.documentElement.dataset.scrollbars = takesRoom
    ? 'classic'
    : 'overlay'
}

export default markScrollbarKind
