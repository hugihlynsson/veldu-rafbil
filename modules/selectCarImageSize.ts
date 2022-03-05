type Size = 'small' | 'medium' | 'large'

const pixelsToSize = {
  small: 400,
  medium: 784,
  large: 1280,
}

const selectCarImageSize = (imageUrl: string, size: Size) => {
  if (!imageUrl.includes("bilasolur.is")) {
    return imageUrl // The image sizer only works for images from bilasolur.is
  }
  if (!imageUrl.includes('?')) {
    return `${imageUrl}?w=${pixelsToSize[size]}`
  }

  if (!imageUrl.includes('&w=')) {
    return `${imageUrl}?w=${pixelsToSize[size]}`
  }

  return imageUrl.replace(/&w=[0-9]*/g, `&w=${pixelsToSize[size]}`)
}

export default selectCarImageSize
