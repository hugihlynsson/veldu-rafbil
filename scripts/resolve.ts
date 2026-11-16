// Lets node run the scripts on its own type stripping: it resolves the `@/`
// alias and the extensionless imports the app's bundler resolves, so the
// modules the scripts share with the site can keep writing theirs that way
import { registerHooks } from 'node:module'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = pathToFileURL(path.join(import.meta.dirname, '..') + '/').href

registerHooks({
  resolve(specifier, context, nextResolve) {
    const aliased = specifier.startsWith('@/')
      ? root + specifier.slice(2)
      : specifier
    try {
      return nextResolve(aliased, context)
    } catch (error) {
      const local = aliased.startsWith('.') || aliased.startsWith('file:')
      if (!local || path.extname(aliased) !== '') throw error
      return nextResolve(`${aliased}.ts`, context)
    }
  },
})
