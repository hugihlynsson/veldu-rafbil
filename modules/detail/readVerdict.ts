import type { Verdict } from './verdictEvents'

// Far past the some 120 words asked for, as a car's review is cut
const MAX_LENGTH = 3000

/**
 * The answer as the page shows it, in paragraphs and without markdown. The
 * page reads the words as they arrive the way the server reads the finished
 * answer, so the verdict it keeps replaces them without a jump.
 */
export const readVerdict = (text: string): Verdict | null => {
  const paragraphs = text
    .slice(0, MAX_LENGTH)
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph
        .replace(/\*\*|__|^#+\s*|^[-*•]\s+/gm, '')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter(Boolean)

  return paragraphs.length > 0 ? { paragraphs } : null
}
