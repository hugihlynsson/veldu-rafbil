// What the harness needs from app/api/chat/route.ts: the system prompt, and the
// model and thinking level production runs with.
//
// A Next route file may only export handlers, so none of this can be imported;
// it is read out of the source instead. That makes the route and this file a
// pair: extract-prompt.test.mjs fails when an edit to the route moves the
// markers below or the two settings, which is the cue to update this file.

const PROMPT_START = '// Create a summary of available cars'
const PROMPT_END = '// Only built when there is a token'

// Evaluates the route's own carsSummary and systemPrompt statements against the
// real car data, so an eval always runs on the prompt production would send.
export function buildSystemPrompt(routeSource, newCars, getPriceWithGrant) {
  const start = routeSource.indexOf(PROMPT_START)
  const end = routeSource.indexOf(PROMPT_END)
  if (start < 0 || end < start) {
    throw new Error(
      'route.ts no longer has the marker comments around its system prompt. Update extract-prompt.mjs.',
    )
  }
  return new Function(
    'newCars',
    'getPriceWithGrant',
    `${routeSource.slice(start, end)}\nreturn { systemPrompt, carsSummary }`,
  )(newCars, getPriceWithGrant)
}

// "google/gemini-3.8-flash@low": the same label the harness gives a variant
export function productionVariant(routeSource) {
  const model = routeSource.match(/const modelName = '([^']+)'/)?.[1]
  const level = routeSource.match(/thinkingLevel: '([^']+)'/)?.[1]
  if (!model || !level) {
    throw new Error(
      'Could not read modelName and thinkingLevel from route.ts. Update extract-prompt.mjs.',
    )
  }
  return `google/${model}@${level}`
}
