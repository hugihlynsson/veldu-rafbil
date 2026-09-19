// Shared setup for the model comparison. Run the scripts from anywhere, with the
// provider keys in the environment:
//   node --env-file=.env.local .claude/skills/compare-assistant-models/scripts/<script>.mjs
import { registerHooks } from 'node:module'
import { readFileSync, existsSync, appendFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { google } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { buildSystemPrompt, productionVariant } from './extract-prompt.mjs'

export const HERE = path.dirname(fileURLToPath(import.meta.url))
export const REPO = path.resolve(HERE, '../../../..')
// Real visitor conversations end up in here, so it is gitignored
export const OUT = path.join(REPO, '.model-eval')

const repoFile = (...parts) => path.join(REPO, ...parts)
const routeSource = readFileSync(repoFile('app/api/chat/route.ts'), 'utf8')

// What the site runs today, as a variant label. Everything is compared to it.
export const PRODUCTION = productionVariant(routeSource)

// Node strips types natively, but the repo imports without extensions and
// imports types without `import type`. Bridge both so the real modules run.
registerHooks({
  resolve(specifier, context, next) {
    try {
      return next(specifier, context)
    } catch (error) {
      if (specifier.startsWith('.')) {
        for (const suffix of ['.ts', '/index.ts']) {
          try {
            return next(specifier + suffix, context)
          } catch {
            // try the next suffix
          }
        }
      }
      throw error
    }
  },
  load(url, context, next) {
    const result = next(url, context)
    if (url.endsWith('.ts') && result.source) {
      const source = String(result.source).replace(
        /^import\s*\{[^}]*\}\s*from\s*'(\.\.?\/)+types'\s*$/gm,
        '',
      )
      return { ...result, source }
    }
    return result
  },
})

export async function loadSystemPrompt() {
  const newCars = (await import(repoFile('modules/newCars.ts'))).default
  const getPriceWithGrant = (
    await import(repoFile('modules/getPriceWithGrant.ts'))
  ).default
  return {
    ...buildSystemPrompt(routeSource, newCars, getPriceWithGrant),
    newCars,
    getPriceWithGrant,
  }
}

export async function loadTool() {
  return (await import(repoFile('app/api/chat/tools/fetchCarDetails.ts')))
    .fetchCarDetailsTool
}

export async function loadChatHelpers() {
  return await import(repoFile('modules/chatHelpers.ts'))
}

export const readJSON = (file) => JSON.parse(readFileSync(file, 'utf8'))
export const readJSONL = (file) =>
  existsSync(file)
    ? readFileSync(file, 'utf8')
        .split('\n')
        .filter(Boolean)
        .map((line) => JSON.parse(line))
    : []
export const appendJSONL = (file, value) =>
  appendFileSync(file, JSON.stringify(value) + '\n')

// Model ids are "provider/model" (the names the AI Gateway's price list uses),
// and each provider is called directly with its own key. The base URLs are
// pinned on purpose: a shell can carry ANTHROPIC_BASE_URL for some other
// purpose, and the provider would send the real API key there.
const openai = createOpenAI({ baseURL: 'https://api.openai.com/v1' })
const anthropic = createAnthropic({ baseURL: 'https://api.anthropic.com/v1' })

export const KEY_FOR = {
  google: 'GOOGLE_GENERATIVE_AI_API_KEY',
  openai: 'OPENAI_API_KEY',
  anthropic: 'ANTHROPIC_API_KEY',
}

export function resolveModel(id) {
  const [provider, ...rest] = id.split('/')
  const name = rest.join('/')
  if (provider === 'google') return google(name)
  if (provider === 'openai') return openai(name)
  // Anthropic ids use dashes where the price list uses dots (fable-5.1 -> fable-5-1)
  if (provider === 'anthropic') return anthropic(name.replaceAll('.', '-'))
  throw new Error(`Unknown provider in model id: ${id}`)
}

export function missingKeys(models) {
  return [
    ...new Set(models.map((model) => KEY_FOR[model.split('/')[0]])),
  ].filter((key) => !process.env[key])
}

// A variant is "provider/model@level": the same model at a different thinking
// setting. Everything downstream (runs, checks, report, judge) keys on the
// whole label, and only the price lookup and the API call want the base id.
export const baseId = (variant) => variant.split('@')[0]

export function providerOptionsFor(variant) {
  const [id, level] = variant.split('@')
  if (!level)
    throw new Error(`Variant needs a thinking level: ${variant}@<level>`)
  const provider = id.split('/')[0]
  if (provider === 'google')
    return { google: { thinkingConfig: { thinkingLevel: level } } }
  if (provider === 'openai') return { openai: { reasoningEffort: level } }
  if (provider === 'anthropic') return { anthropic: { effort: level } }
  throw new Error(`Unknown provider in model id: ${id}`)
}
