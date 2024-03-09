import cheerio from 'cheerio'
import url from 'url'

import { UsedCar } from '../types'

export default async (): Promise<Array<UsedCar>> => {
  const cars: Array<UsedCar> = []

  const fetchRes = await fetch('https://bilasolur.is/Section.aspx?s=1', {
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: '__EVENTTARGET=&__EVENTARGUMENT=&__VIEWSTATE=hGRS08dtzNZxPR3z78Z0ypyWSrVLPhpqa6D%2F4xYGdfITcuKV5IvuHxXUJqJ1ZFfB7gVzpGtfK7oTbOyyfCTlsnXJVq5SVxl10UI3A5Qc7DHSrEGKWDikxGqE5jsM6JZC1PcO%2BcfaHiBwoRsns5V9q81Gn0olp3f7uHi5IWT5wmrvCMD4iswk7vcThHCUHdStH3rgQQO4TobtAkda0Ta9WATpI3QrBsSFMZCYJ1LPVkNbm7SQLWSyVQFyZdc81WbDJFboMddSmziOkk8G3RphbzO0D2f8iCPmAIgDao19ePC3%2FSth9BsqHove0P6u%2F%2BGVPqxqG%2Bzr2E0tBnrGjQUoE4H7mErk21g5%2Bha7STcQEPL7KFWygbcfRODRLzACujtXh%2FZULW0tYIFoNQmVNMdrsn581tadTACrklzOD1S4iZ1TLVsGnNWMlaz9aKqbpp5XyskWSjOMUsDyGFnP2oKiuBAsan6yJ3Lmm34RgpPFU7u%2F4GUGlOdOXQQDYXe1eBJUOuU6wV3QnE%2BSOh1ypnPnGIpQz0PqVXaHeBZdzZYW5WvDdo%2FXN0cNF37r4%2F2yFN7WQKDxvdH6di5WODxfRZrHjq6%2FcEF9sa22dCEjcek%2Bizl34iWcNw0ay07ZtsyjSBvhmGLo8JEFD2x5xyG9D%2Ftd2fDAMlNWZGP9eXv5H9La0gFzhZz%2BcQs%2FO9vbh50QbDmEuOLXZksgGKNpsrLsc5IHSYveJMilyML1l28dLL6nFkP3iM%2B9k2xQa3jihAqLKW1JKhFOhIQfLDIJoOBPTMG%2Fzn5WI6s6bhRPazZRKTzcatndVKmqEO%2BQBkZwOwR9rX9L4lEZZFWgf6txB3qsQHKQEMTRTrNrYjaUc7sEbJa5Cqz57dMeStYsZ6GzEDDBHAxKfux%2FiDSG3VHHqgPpmryB9v8OCE3SxKUHaj%2F4yYodRYzp%2FsBmpT3bFLGC7ZnsXehpg7Ojxugu2%2F1fDDXJ8xm05jBYD0eRLdnwG3XeHhAfQf%2FaGvIfcUKj%2FQJK2EhzjDPT0BHbI5OpD5cZx7leFUTVSKsetPm2o7mmT9qHPLD7y1Fe%2FoHSV%2FpClNhvMOODvwINMMLDPBonwbeVgCFY1YmAqmeXwzG8SBwUoMWa3nO%2FNsLwmQsteGg3V3SokHaWkhXgbXNvq9XOjDG9lS%2F%2Ff8EvT1LknhhcAZqKGopY9HH2Zsmi00OtzPVqtfLkuAOkKK2N&__VIEWSTATEGENERATOR=A13C9EF1&ctl00%24serialnumbersearch_cid=&ctl00%24contentSearchEngine%24ctl00%24search_f1=-1&ctl00%24contentSearchEngine%24ctl00%24search_g1=-1&ctl00%24contentSearchEngine%24ctl00%24search_ug1=&ctl00%24contentSearchEngine%24ctl00%24search_vf=-1&ctl00%24contentSearchEngine%24ctl00%24search_vt=-1&ctl00%24contentSearchEngine%24ctl00%24search_arf=-1&ctl00%24contentSearchEngine%24ctl00%24search_art=-1&ctl00%24contentSearchEngine%24ctl00%24search_ef=-1&ctl00%24contentSearchEngine%24ctl00%24search_et=-1&ctl00%24contentSearchEngine%24ctl00%24search_fe=on&ctl00%24contentSearchEngine%24ctl00%24btnSearch=Leita&ctl00%24contentSearchEngine%24ctl00%24src_f1_hidden=-1&ctl00%24contentSearchEngine%24ctl00%24src_g1_hidden=-1',
  })
  const parsedPage = cheerio.load(await fetchRes.text())
  const parsedPages = [parsedPage]

  let lastPageFound = false

  const getNextPageLink = (parsedPage: cheerio.Root) =>
    parsedPage('.pagingCell .fa-angle-right').parent().attr('href')

  const setPage = (pageLink: string, page: number) =>
    // We're expecting a string that looks like this:
    // "SearchResults.aspx?page=4454&id=ae3be579-e967-4fe2-acee-a3ebce261a7c"
    pageLink.replace(/page=\d+/, `page=${page}`)

  const getPage = async (pageLink: string): Promise<void> => {
    const response = await fetch(pageLink)
    const parsedPage = cheerio.load(await response.text())

    const nextPageLink = getNextPageLink(parsedPage)

    if (lastPageFound && !nextPageLink) {
      // On this server, any page that is beyond the last page will include the same content
      // as the last one. That is, if page n is the last page, then page n+1 will have the exact same content, as oposite of being just empty or a 404.
      // So if we've already found a "last page" and this is also a "last page" we don't
      // want to include duplicate the content
      return
    }

    // If we've found the last page, make sure that we stop the chain
    if (!nextPageLink) {
      lastPageFound = true
    }

    // Finally add the content to the list of collected pages
    parsedPages.push(parsedPage)
  }

  const batchSize = 20
  const getPageBatch = async (baseLink: string, firstPageIndex: number) => {
    // Create an array of length batchSize, starting at firstPageIndex
    // Map each index, fetching the correct page for each one
    console.log('Fetching batch from:', firstPageIndex)
    await Promise.all(
      Array.from({ length: batchSize }, (_x, i) =>
        getPage(setPage(baseLink, i + firstPageIndex)),
      ),
    )

    console.log('Done fetching batches! Last page found:', lastPageFound)
    if (!lastPageFound) {
      await getPageBatch(baseLink, firstPageIndex + batchSize)
    }
  }

  const nextPageLink = getNextPageLink(parsedPage)

  if (nextPageLink) {
    await getPageBatch(`https://bilasolur.is/${nextPageLink}`, 2)
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
