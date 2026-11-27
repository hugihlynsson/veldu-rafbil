// A crawler names itself and links to a page about itself; a browser does
// neither. "bot/" wants its slash, as phones like the CUBOT carry the word.
const crawlerMarks = /https?:\/\/|bot\/|crawler|spider|headless|lighthouse/i

/**
 * Whether a request comes from something that renders pages rather than a
 * person, by the user agent it sends. One that sends none is no browser.
 */
export const isCrawler = (userAgent: string | null): boolean =>
  !userAgent || crawlerMarks.test(userAgent)
