export const MIN_WORDS = 50
export const MAX_WORDS = 5000

export const FILLER_PHRASES = [
  'kind of',
  'sort of',
  'you know',
  'i mean',
  'i guess',
  'like i said',
  'basically',
  'actually',
  'literally',
  'honestly',
  'really',
  'very',
  'just',
  'anyway',
]

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function countWords(text: string): number {
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}

export function splitSentences(text: string): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (!normalized) return []
  const matches = normalized.match(/[^.!?]+[.!?]+["')\]]*|[^.!?]+$/g)
  return matches ? matches.map((sentence) => sentence.trim()).filter(Boolean) : []
}

export function findFillers(text: string): string[] {
  const lower = text.toLowerCase()
  return FILLER_PHRASES.filter((phrase) =>
    new RegExp(`(^|[^a-z])${escapeRegExp(phrase)}([^a-z]|$)`, 'i').test(lower),
  )
}

export function fillerPattern(phrase: string): RegExp {
  return new RegExp(`\\b${escapeRegExp(phrase)}\\b[ ,]*`, 'gi')
}

export function normalizeForComparison(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase()
}

export function formatSpeakingTime(words: number): string {
  if (words <= 0) return '0 min'
  const totalSeconds = Math.round((words / 140) * 60)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (minutes === 0) return `${seconds}s`
  return seconds === 0 ? `${minutes} min` : `${minutes} min ${seconds}s`
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'today'
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}
