// A crawler links to a page about itself, gives a bot's name, or calls itself
// "compatible", which no browser has sent since Internet Explorer 10; headless
// and audit tools say what they are. "bot" wants a "/" or "-" after it, as
// phones like the CUBOT carry the word.
const crawlerMarks =
  /https?:\/\/|bot[/-]|compatible;|crawler|spider|headless|lighthouse/i

/**
 * Whether a request comes from something that renders pages rather than a
 * person, by the user agent it sends. One that sends none is no browser.
 */
export const isCrawler = (userAgent: string | null): boolean =>
  !userAgent || crawlerMarks.test(userAgent)
