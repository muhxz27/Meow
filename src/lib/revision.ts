import type { Goal, RevisionResult, SpeechDraft } from '../types'
import { SAMPLE_REVISION, SAMPLE_SPEECH } from './sampleSpeech'
import { FILLER_PHRASES, countWords, fillerPattern, normalizeForComparison, splitSentences } from './text'

const HOOKS: Record<Goal, (title: string) => string> = {
  Inform: (title) => `“${title}” sounds simple until you have to explain it out loud.`,
  Persuade: (title) =>
    `I am going to ask you to change your mind about ${lowerFirst(title)} — and I only need three minutes to try.`,
  Inspire: (title) => `Somewhere in the next few minutes, ${lowerFirst(title)} stops being an idea and becomes a decision.`,
  Entertain: (title) => `${title} is the kind of subject that sounds serious right up until you look at it closely.`,
}

const CLOSERS: Record<Goal, (title: string) => string> = {
  Inform: (title) =>
    `If you take one thing away, take this: ${lowerFirst(title)} is worth understanding properly, not just recognising.`,
  Persuade: () =>
    'So here is my ask. Pick the one thing from this talk you can act on this week — and do it before you feel ready.',
  Inspire: () => 'You do not need permission to begin. You need a first step small enough to take today.',
  Entertain: (title) => `And if nothing else stays with you, at least you will never hear ${lowerFirst(title)} quite the same way again.`,
}

const MID_TRANSITIONS = [
  'Here is where it starts to matter.',
  'Now consider what that actually means.',
  'This is the part most people skip.',
]

const LATE_TRANSITIONS = [
  'Which brings me to the point I want you to leave with.',
  'So here is what that changes.',
  'That leads me to the ask.',
]

function lowerFirst(value: string): string {
  const trimmed = value.trim() || 'this idea'
  if (/^[A-Z]{2,}/.test(trimmed)) return trimmed
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1)
}

function hashString(value: string): number {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function cleanText(text: string): string {
  let output = text.replace(/\r\n/g, '\n')
  const phrases = [...FILLER_PHRASES].sort((a, b) => b.length - a.length)
  for (const phrase of phrases) {
    output = output.replace(fillerPattern(phrase), '')
  }
  output = output
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/([,.;:!?])\s*\1+/g, '$1')
    .replace(/,\s*,/g, ',')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  output = output.replace(/(^|[.!?]\s+)([a-z])/g, (_match, prefix: string, letter: string) => {
    return `${prefix}${letter.toUpperCase()}`
  })
  return output
}

function isWeakOpening(sentence: string): boolean {
  return /^(today|hi|hello|good (morning|afternoon|evening)|i want to talk about|i'd like to talk about|in this (speech|talk)|so,? today)/i.test(
    sentence.trim(),
  )
}

function isSignOff(sentence: string): boolean {
  return /^(so,? )?(thank you|thanks)( for (listening|your time|coming))?[.!]*$/i.test(sentence.trim())
}

function chunk<T>(items: T[], size: number): T[][] {
  const groups: T[][] = []
  for (let index = 0; index < items.length; index += size) {
    groups.push(items.slice(index, index + size))
  }
  return groups
}

function polishDraft(draft: SpeechDraft): RevisionResult {
  const title = draft.title.trim() || 'this idea'
  const cleaned = cleanText(draft.text)
  const sentences = splitSentences(cleaned).filter((sentence) => countWords(sentence) > 0)

  let bodySentences = [...sentences]
  if (bodySentences.length > 2 && isWeakOpening(bodySentences[0])) bodySentences.shift()
  while (bodySentences.length > 1 && isSignOff(bodySentences[bodySentences.length - 1])) bodySentences.pop()
  if (bodySentences.length === 0) bodySentences = ['The point I want to leave you with is simple.']

  const hook = HOOKS[draft.goal](title)
  const closer = CLOSERS[draft.goal](title)
  const groups = chunk(bodySentences, bodySentences.length >= 7 ? 3 : 2)
  const seed = hashString(`${cleaned}|${draft.goal}`)
  const paragraphs: string[] = [hook]

  groups.forEach((group, index) => {
    if (index === 1 && groups.length > 1) {
      paragraphs.push(MID_TRANSITIONS[seed % MID_TRANSITIONS.length])
    } else if (index > 1 && index === groups.length - 1) {
      paragraphs.push(LATE_TRANSITIONS[(seed + index) % LATE_TRANSITIONS.length])
    }
    paragraphs.push(group.join(' '))
  })

  paragraphs.push(closer)

  return {
    text: paragraphs.join('\n\n'),
    note: 'Demo revision: your draft with filler removed, a deliberate opening and close added, and signposts inserted between ideas. Read it aloud and keep the structure, not necessarily the phrasing.',
  }
}

export function buildRevision(draft: SpeechDraft): RevisionResult {
  if (normalizeForComparison(draft.text) === normalizeForComparison(SAMPLE_SPEECH)) {
    return {
      text: SAMPLE_REVISION,
      note: 'Hand-written model revision of the sample speech. Compare it with the original to see how a concrete opening, signposted middle, and direct ask change the delivery.',
    }
  }
  return polishDraft(draft)
}
