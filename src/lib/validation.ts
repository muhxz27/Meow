import type { SpeechDraft } from '../types'
import { MAX_WORDS, MIN_WORDS, countWords } from './text'

export interface DraftErrors {
  title?: string
  text?: string
}

export function validateDraft(draft: SpeechDraft): DraftErrors {
  const errors: DraftErrors = {}
  const title = draft.title.trim()

  if (title.length < 3) {
    errors.title = 'Give your speech a title of at least 3 characters.'
  } else if (title.length > 120) {
    errors.title = 'Keep the title under 120 characters.'
  }

  const words = countWords(draft.text)
  if (words === 0) {
    errors.text = `Write or paste your speech — at least ${MIN_WORDS} words are needed for analysis.`
  } else if (words < MIN_WORDS) {
    const remaining = MIN_WORDS - words
    errors.text = `Your speech is ${words} ${words === 1 ? 'word' : 'words'}. Add ${remaining} more to reach the ${MIN_WORDS}-word minimum.`
  } else if (words > MAX_WORDS) {
    errors.text = `This demo analyses up to ${MAX_WORDS.toLocaleString('en-US')} words. Trim ${(
      words - MAX_WORDS
    ).toLocaleString('en-US')} words to continue.`
  }

  return errors
}

export function hasDraftErrors(errors: DraftErrors): boolean {
  return Boolean(errors.title || errors.text)
}
