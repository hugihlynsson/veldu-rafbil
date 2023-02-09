import cheerio from 'cheerio'
import url from 'url'

import { UsedCar } from '../types'

export default async (): Promise<Array<UsedCar>> => {
  const cars: Array<UsedCar> = []

  const fetchRes = await fetch('https://bilasolur.is/Section.aspx?s=1', {
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: '__EVENTTARGET=&__EVENTARGUMENT=&__VIEWSTATE=%2FwEPDwUKLTc2Njc0ODQ4OWQYAQUeX19Db250cm9sc1JlcXVpcmVQb3N0QmFja0tleV9fFhIFKmN0bDAwJGNvbnRlbnRTZWFyY2hFbmdpbmUkY3RsMDAkc2VhcmNoX3htYQUqY3RsMDAkY29udGVudFNlYXJjaEVuZ2luZSRjdGwwMCRzZWFyY2hfeG1tBShjdGwwMCRjb250ZW50U2VhcmNoRW5naW5lJGN0bDAwJHNlYXJjaF9wBSpjdGwwMCRjb250ZW50U2VhcmNoRW5naW5lJGN0bDAwJHNlYXJjaF9vZmYFK2N0bDAwJGNvbnRlbnRTZWFyY2hFbmdpbmUkY3RsMDAkc2VhcmNoX2Z0XzAFK2N0bDAwJGNvbnRlbnRTZWFyY2hFbmdpbmUkY3RsMDAkc2VhcmNoX2Z0XzEFKWN0bDAwJGNvbnRlbnRTZWFyY2hFbmdpbmUkY3RsMDAkc2VhcmNoX2ZlBSljdGwwMCRjb250ZW50U2VhcmNoRW5naW5lJGN0bDAwJHNlYXJjaF9maAUqY3RsMDAkY29udGVudFNlYXJjaEVuZ2luZSRjdGwwMCRzZWFyY2hfZnBoBStjdGwwMCRjb250ZW50U2VhcmNoRW5naW5lJGN0bDAwJHNlYXJjaF9mdF80BSxjdGwwMCRjb250ZW50U2VhcmNoRW5naW5lJGN0bDAwJHNlYXJjaF9jYXRfMAUsY3RsMDAkY29udGVudFNlYXJjaEVuZ2luZSRjdGwwMCRzZWFyY2hfY2F0XzEFLWN0bDAwJGNvbnRlbnRTZWFyY2hFbmdpbmUkY3RsMDAkc2VhcmNoX2NhdF8xNAUsY3RsMDAkY29udGVudFNlYXJjaEVuZ2luZSRjdGwwMCRzZWFyY2hfY2F0XzgFLWN0bDAwJGNvbnRlbnRTZWFyY2hFbmdpbmUkY3RsMDAkc2VhcmNoX2NhdF8yOAUsY3RsMDAkY29udGVudFNlYXJjaEVuZ2luZSRjdGwwMCRzZWFyY2hfY2F0XzIFLGN0bDAwJGNvbnRlbnRTZWFyY2hFbmdpbmUkY3RsMDAkc2VhcmNoX2NhdF8zBSxjdGwwMCRjb250ZW50U2VhcmNoRW5naW5lJGN0bDAwJHNlYXJjaF9jYXRfNLT%2FS2NMk1l%2FGM1VVrMmL%2BZ8Lma0HeRSiTkAOmx3WgYw&__VIEWSTATEGENERATOR=A13C9EF1&ctl00%24serialnumbersearch_cid=&ctl00%24contentSearchEngine%24ctl00%24search_f1=-1&ctl00%24contentSearchEngine%24ctl00%24search_g1=-1&ctl00%24contentSearchEngine%24ctl00%24search_ug1=&ctl00%24contentSearchEngine%24ctl00%24search_vf=-1&ctl00%24contentSearchEngine%24ctl00%24search_vt=-1&ctl00%24contentSearchEngine%24ctl00%24search_arf=-1&ctl00%24contentSearchEngine%24ctl00%24search_art=-1&ctl00%24contentSearchEngine%24ctl00%24search_ef=-1&ctl00%24contentSearchEngine%24ctl00%24search_et=-1&ctl00%24contentSearchEngine%24ctl00%24search_fe=on&ctl00%24contentSearchEngine%24ctl00%24btnSearch=Leita&ctl00%24contentSearchEngine%24ctl00%24src_f1_hidden=-1&ctl00%24contentSearchEngine%24ctl00%24src_g1_hidden=-1',
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
