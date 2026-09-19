// Mechanical checks on one reply. `hard` ones are contract violations the app
// or the system prompt states outright; `soft` ones are worth a look but can be
// legitimate (a difference between two prices is not in the car list).
import { loadSystemPrompt, loadChatHelpers } from './lib.mjs'

const { newCars, getPriceWithGrant } = await loadSystemPrompt()
const { parseFollowUps } = await loadChatHelpers()

const postGrant = new Set(newCars.map((car) => getPriceWithGrant(car.price)))
// A list price that is not also somebody's post-grant price is the tell for
// "the grant was not applied"
const listOnly = new Set(
  newCars.map((car) => car.price).filter((price) => !postGrant.has(price)),
)
const allowedURLs = new Set(
  newCars.map((car) => car.evDatabaseURL).filter(Boolean),
)

const ENGLISH =
  /\b(the|and|is|are|of|with|for|this|that|you|your|which|best|range|price)\b/gi

export function check(run) {
  const text = run.text ?? ''
  const lines = text.split('\n')
  const followUps = parseFollowUps(text)

  const tableRows = lines.filter((line) => line.trim().startsWith('|'))
  const widest = Math.max(
    0,
    ...tableRows.map(
      (line) =>
        line
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|').length,
    ),
  )

  const prices = [
    ...text.matchAll(/(\d{1,3}(?:[.,]\d{3})+)\s*(?:kr|ISK|krónur)/gi),
  ].map((m) => Number(m[1].replace(/[.,]/g, '')))
  const words = text.split(/\s+/).length

  return {
    hard: {
      answered: text.trim().length > 0 && !run.error,
      threeFollowUps: followUps.length === 3,
      followUpsAtEnd:
        !/\[q:[^\]]*\]\s*[^\s[]/.test(text.trim().slice(-400)) ||
        followUps.length === 0,
      plainText: !/^\s*(\{|```json)/.test(text),
      noRules:
        !lines.some((line) => /^\s*([-*_])\1{2,}\s*$/.test(line)) &&
        !/<hr/i.test(text),
      tablesMax3Columns: widest <= 3,
      icelandic: (text.match(ENGLISH) ?? []).length / words < 0.04,
      grantApplied: !prices.some((price) => listOnly.has(price)),
      onlyListedURLs: (run.toolCalls ?? []).every((call) =>
        allowedURLs.has(call.input?.url),
      ),
    },
    soft: {
      priceNotInList: prices.filter(
        (price) =>
          price >= 1_000_000 && !postGrant.has(price) && !listOnly.has(price),
      ).length,
      chars: text.length,
      toolCalls: (run.toolCalls ?? []).length,
    },
  }
}
