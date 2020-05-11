import cheerio from 'cheerio'
import url from 'url'

import { UsedCar } from '../types'

export default async (): Promise<Array<UsedCar>> => {
  const cars: Array<UsedCar> = []

  const fetchRes = await fetch('https://bilasolur.is/Section.aspx?s=1', {
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body:
      '__VIEWSTATE=%2FwEPDwULLTEwMTg4OTM5MjlkGAEFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYPBSVjdGwwMCRMb2dpblZpZXcxJGxvZ2luRm9ybSRSZW1lbWJlck1lBSpjdGwwMCRjb250ZW50U2VhcmNoRW5naW5lJGN0bDAwJHNlYXJjaF94bWEFKmN0bDAwJGNvbnRlbnRTZWFyY2hFbmdpbmUkY3RsMDAkc2VhcmNoX3htbQUrY3RsMDAkY29udGVudFNlYXJjaEVuZ2luZSRjdGwwMCRzZWFyY2hfZnRfMAUrY3RsMDAkY29udGVudFNlYXJjaEVuZ2luZSRjdGwwMCRzZWFyY2hfZnRfMQUpY3RsMDAkY29udGVudFNlYXJjaEVuZ2luZSRjdGwwMCRzZWFyY2hfZmUFKWN0bDAwJGNvbnRlbnRTZWFyY2hFbmdpbmUkY3RsMDAkc2VhcmNoX2ZoBSxjdGwwMCRjb250ZW50U2VhcmNoRW5naW5lJGN0bDAwJHNlYXJjaF9jYXRfMAUsY3RsMDAkY29udGVudFNlYXJjaEVuZ2luZSRjdGwwMCRzZWFyY2hfY2F0XzEFLWN0bDAwJGNvbnRlbnRTZWFyY2hFbmdpbmUkY3RsMDAkc2VhcmNoX2NhdF8xNAUsY3RsMDAkY29udGVudFNlYXJjaEVuZ2luZSRjdGwwMCRzZWFyY2hfY2F0XzgFLWN0bDAwJGNvbnRlbnRTZWFyY2hFbmdpbmUkY3RsMDAkc2VhcmNoX2NhdF8yOAUsY3RsMDAkY29udGVudFNlYXJjaEVuZ2luZSRjdGwwMCRzZWFyY2hfY2F0XzIFLGN0bDAwJGNvbnRlbnRTZWFyY2hFbmdpbmUkY3RsMDAkc2VhcmNoX2NhdF8zBSxjdGwwMCRjb250ZW50U2VhcmNoRW5naW5lJGN0bDAwJHNlYXJjaF9jYXRfNKOZpV4%2BDwHqftYBSHd8irWHmjM0eVxLyBvG0Gx197tY&ctl00%24contentSearchEngine%24ctl00%24search_fe=on&ctl00%24contentSearchEngine%24ctl00%24btnSearch=Leita',
  })
  const parsedPage = cheerio.load(await fetchRes.text())
  const parsedPages = [parsedPage]

  const getNextPage = async (nextPageLink: string): Promise<void> => {
    const nextRes = await fetch(nextPageLink)

    const parsedNextHtml = cheerio.load(await nextRes.text())
    parsedPages.push(parsedNextHtml)

    const nextestPageLink = parsedNextHtml('.pagingCell .fa-angle-right')
      .parent()
      .attr('href')

    if (nextestPageLink) {
      return getNextPage(`https://bilasolur.is/${nextestPageLink}`)
    }
  }

  const nextPageLink = parsedPage('.pagingCell .fa-angle-right')
    .parent()
    .attr('href')

  if (nextPageLink) {
    await getNextPage(`https://bilasolur.is/${nextPageLink}`)
  }

  parsedPages.map((page) => {
    const srItems = page('.sr-item')
    srItems.each((_, element) => {
      const parsedElement = cheerio(element)
      const link = parsedElement.find('.sr-link').attr('href')
      if (!link) {
        // There are .sr-link items that are not car listings
        return
      }

      const serialNumber = url.parse(link, true).query.cid

      const imageSrc = parsedElement.find('img.swiper-slide').attr('src')

      const model = parsedElement
        .find('.car-make-and-model')
        .text()
        .split(parsedElement.find('.car-make').text())
        .join('')
        .trim()

      const details = parsedElement.find('.tech-details div')
      const priceText = parsedElement.find('.car-price span').text()

      cars.push({
        firstSeen: new Date().toISOString(),
        serialNumber: Number(serialNumber),
        image: imageSrc && `https://bilasolur.is/${imageSrc}`,
        link: `https://bilasolur.is/${link}`,
        make: parsedElement.find('.car-make').text(),
        model: model.split(' ')[0],
        modelExtra: model.split(' ').slice(1).join(' '),
        date: cheerio(details[0]).text().split(' · ')[0],
        milage: cheerio(details[1]).text().split(' · ')[0],
        price: priceText ? Number(priceText.split('.').join('')) : undefined,
      })
    })
  })

  return cars
}
