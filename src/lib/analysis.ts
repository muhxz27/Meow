import type { Analysis, Audience, Goal, ScoreDetail, ScoreKey, SpeechDraft } from '../types'
import { countWords, findFillers, splitSentences } from './text'

const LABELS: Record<ScoreKey, string> = {
  openingHook: 'Opening Hook',
  clarity: 'Clarity',
  structure: 'Structure',
  engagement: 'Audience Engagement',
  conclusion: 'Conclusion',
}

const NOTES: Record<ScoreKey, { strong: string; solid: string; weak: string }> = {
  openingHook: {
    strong: 'You earn attention immediately — specific, visual, and impossible to skim past.',
    solid: 'The opening sets a direction, but a sharper image or number would make the first ten seconds land harder.',
    weak: 'The draft announces its topic before earning attention. Lead with tension, a question, or a concrete scene.',
  },
  clarity: {
    strong: 'Sentences are easy to follow aloud. A listener can hold each idea without backtracking.',
    solid: 'Most ideas land, though long sentences and soft filler words slow the middle.',
    weak: 'Hedging and uneven sentence lengths create drag. Trim the padding so each line does one job.',
  },
  structure: {
    strong: 'The talk has a visible shape: setup, progression, and a deliberate close.',
    solid: 'There is movement from start to finish, but the middle needs firmer signposts.',
    weak: 'Ideas arrive by accumulation rather than design. Add paragraph-level signposts and one clear turn.',
  },
  engagement: {
    strong: 'The audience is spoken to, not at — direct address and concrete stakes keep them with you.',
    solid: 'You address the audience, but some claims stay abstract; one more concrete example would tighten the grip.',
    weak: 'The talk mostly describes a subject. Bring the listener in with direct address and a scene they recognise.',
  },
  conclusion: {
    strong: 'The close resolves the argument and gives the audience something to do next.',
    solid: 'The ending circles the point but softens before it asks for anything.',
    weak: 'The close fades into thanks instead of resolving the argument. End on the ask, not the courtesy.',
  },
}

const STRENGTH_BY_KEY: Record<ScoreKey, string> = {
  openingHook: 'The opening earns attention early; listeners know within ten seconds why this matters.',
  clarity: 'Sentences stay readable out loud, so the central idea survives the first listen.',
  structure: 'The draft has a recognisable shape — setup, development, and a move toward a close.',
  engagement: 'Direct address and concrete stakes give the audience a reason to stay involved.',
  conclusion: 'The close returns to the point and gives the audience somewhere to land.',
}

const WEAKNESS_BY_KEY: Record<ScoreKey, string> = {
  openingHook: 'The opening explains the topic instead of earning attention, so the first seconds do no work.',
  clarity: 'Filler phrases and uneven sentence lengths make the middle harder to follow at speaking pace.',
  structure: 'Paragraphs accumulate rather than progress; the audience has to infer the shape of the argument.',
  engagement: 'The draft rarely puts the listener in the scene, so the stakes stay abstract for most of the room.',
  conclusion: 'The ending retreats into a courtesy thank-you rather than resolving the point or asking for action.',
}

const FALLBACK_STRENGTHS = [
  'The central idea is clear enough to build a memorable talk around.',
  'The draft is committed to its position, which gives revision something to sharpen.',
  'The subject is specific rather than generic, which makes concrete examples easier to add.',
]

const FALLBACK_WEAKNESSES = [
  'Some claims arrive without a concrete example to anchor them.',
  'The middle could use one more beat of tension before it resolves.',
]

const BASE_DELIVERY_TIPS = [
  'Mark your two biggest pauses in the script. Silence after a key line reads as confidence, not hesitation.',
  'Land your final sentence, hold eye contact for three seconds, then stop. Do not fill the silence.',
  'Slow down roughly 15% for the first thirty seconds — nerves compress pace before the room has settled.',
  'Use one deliberate gesture per key point instead of continuous hand movement.',
  'Record yourself once on your phone. Listen for filler words and pace, not for perfection.',
  'Breathe from the belly before your first line; a shallow breath makes the opening sound rushed.',
  'Rehearse standing up and out loud. Silent reading hides the lines that will trip you on stage.',
]

const AUDIENCE_TIP: Record<Audience, string> = {
  General: 'Read the room before you begin: one beat of eye contact with each side of the audience buys attention.',
  Students: 'Practise in the room where you will speak if you can. Familiar surroundings cut the adrenaline spike.',
  Professionals: 'Lead with the outcome, then support it. Senior audiences reward directness over preamble.',
  Judges: 'Time yourself against the rubric. Running over the limit is one of the most common scoring penalties.',
}

const GOAL_TIP: Record<Goal, string> = {
  Inform: 'Pause after each key point instead of after each sentence; it lets the audience file the idea.',
  Persuade: 'Drop your voice and slow down on the single sentence you most want remembered.',
  Inspire: 'Build the final third toward one line you can deliver without notes — that is the moment people quote.',
  Entertain: 'Hold a beat after each punchline. Laughter needs the silence you leave for it.',
}

const AUDIENCE_PATTERN: Record<Audience, RegExp> = {
  General: /\b(community|family|people|world|everyday|neighbour|neighbor)\b/i,
  Students: /\b(student|class|classroom|school|campus|college|university|exam)\b/i,
  Professionals: /\b(team|work|career|business|client|office|company|manager|meeting)\b/i,
  Judges: /\b(criteria|evidence|case|argument|judg|competition|round|rubric|score)\b/i,
}

const GOAL_PATTERN: Record<Goal, RegExp> = {
  Inform: /\b(data|research|study|evidence|fact|explain|understand|learn|example)\b/i,
  Persuade: /\b(should|must|need to|we can|change|act|choose|believe|agree|support)\b/i,
  Inspire: /\b(dream|hope|believe|possible|change|courage|future|together|begin)\b/i,
  Entertain: /\b(funny|joke|laugh|humor|humour|story|absurd|ridiculous|delight)\b/i,
}

function hashString(value: string): number {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function variance(seed: string, spread = 4): number {
  return (hashString(seed) % (spread * 2 + 1)) - spread
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)))
}

function splitParagraphs(text: string): string[] {
  const trimmed = text.trim()
  if (!trimmed) return []
  const byBlankLine = trimmed
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
  if (byBlankLine.length > 1) return byBlankLine
  const byLine = trimmed
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
  if (byLine.length > 1) return byLine
  return [trimmed]
}

function countMatches(text: string, pattern: RegExp): number {
  return text.match(pattern)?.length ?? 0
}

function noteFor(key: ScoreKey, score: number): string {
  if (score >= 85) return NOTES[key].strong
  if (score >= 70) return NOTES[key].solid
  return NOTES[key].weak
}

function verdictFor(overall: number): string {
  if (overall >= 85) return 'Competition-ready, with a small polish pass remaining.'
  if (overall >= 75) return 'A strong draft — targeted edits will lift it to stage standard.'
  if (overall >= 65) return 'A solid foundation. The shape works; the opening and close need real work.'
  return 'An early draft. The idea is present, but the delivery on the page needs rebuilding.'
}

function openingScore(sentences: string[], seed: string): number {
  const first = sentences[0] ?? ''
  const opening = sentences.slice(0, 2).join(' ')
  const firstWords = countWords(first)
  let score = 55

  if (first.includes('?')) score += 12
  if (/\b(imagine|picture|what if|consider|suppose)\b/i.test(opening)) score += 9
  if (/\b\d[\d,.]*\b/.test(opening)) score += 7
  if (/\b(you|your)\b/i.test(opening)) score += 5
  if (
    /^(today|hi|hello|good (morning|afternoon|evening)|i want to talk about|i'd like to talk about|in this (speech|talk))/i.test(
      first.trim(),
    )
  ) {
    score -= 10
  }
  if (/\b(when i|last year|last week|one day|remember|story|minutes|hours|days)\b/i.test(opening)) score += 5
  if (firstWords >= 4 && firstWords <= 22) score += 3
  else if (firstWords > 22) score -= 5
  if (firstWords > 0 && firstWords <= 6) score += 2

  return clamp(score + variance(`${seed}|opening`, 3), 32, 97)
}

function clarityScore(
  words: string[],
  sentenceCount: number,
  fillerCount: number,
  seed: string,
): number {
  const average = sentenceCount ? words.length / sentenceCount : 0
  let score = 64

  if (average >= 11 && average <= 22) score += 9
  else if (average > 22 && average <= 27) score += 2
  else if (average > 27) score -= Math.min(16, (average - 22) * 1.6)
  else if (average > 0) score -= 6

  score -= Math.min(18, fillerCount * 3)

  const longRatio = words.filter((word) => word.length >= 10).length / Math.max(1, words.length)
  if (longRatio > 0.2) score -= 6
  if (sentenceCount >= 5) score += 3

  return clamp(score + variance(`${seed}|clarity`, 3), 38, 97)
}

function structureScore(paragraphs: string[], text: string, sentenceCount: number, seed: string): number {
  let score = 58
  const count = paragraphs.length

  if (count >= 3 && count <= 7) score += 10
  else if (count === 2) score += 2
  else if (count <= 1) score -= 10
  else score -= 3

  const connectors = countMatches(
    text,
    /\b(first|second|third|next|then|finally|however|therefore|because|so|which brings me|as a result|in contrast|more importantly)\b/gi,
  )
  score += Math.min(10, connectors * 2)

  if (/\b(first|second|third|finally|to conclude|in conclusion|to sum up)\b/i.test(text)) score += 6
  if (/\b(which brings me|that is why|here is what|here is the thing|the point is)\b/i.test(text)) score += 3

  if (count >= 3) {
    const averageSentences = sentenceCount / count
    if (averageSentences >= 2 && averageSentences <= 6) score += 3
  }

  return clamp(score + variance(`${seed}|structure`, 3), 40, 97)
}

function engagementScore(
  text: string,
  wordCount: number,
  youCount: number,
  questionCount: number,
  audience: Audience,
  goal: Goal,
  seed: string,
): number {
  let score = 55
  const density = wordCount ? (youCount / wordCount) * 100 : 0
  score += Math.min(12, density * 2)
  score += Math.min(8, questionCount * 3)
  if (/\b(when i|last year|one day|remember|i used to|my first|story)\b/i.test(text)) score += 5
  if (AUDIENCE_PATTERN[audience].test(text)) score += 5
  if (GOAL_PATTERN[goal].test(text)) score += 5
  if (/\b\d[\d,.]*\b/.test(text)) score += 3

  return clamp(score + variance(`${seed}|engagement`, 3), 40, 97)
}

function conclusionScore(paragraphs: string[], text: string, seed: string): number {
  const lastParagraph = paragraphs[paragraphs.length - 1] ?? text
  const lastSentences = splitSentences(lastParagraph)
  const lastSentence = lastSentences[lastSentences.length - 1] ?? ''
  const lastWords = countWords(lastParagraph)
  let score = 56

  if (
    /\b(join|start|choose|commit|ask|try|take|find|step|today|tonight|this (week|month|year)|act)\b/i.test(
      lastParagraph,
    )
  ) {
    score += 8
  }
  if (lastSentence.includes('?')) score += 8
  if (
    /\b(in conclusion|to sum up|ultimately|remember this|so here is|my ask|call to action|the next step)\b/i.test(
      lastParagraph,
    )
  ) {
    score += 5
  }
  if (/^thank you( for (listening|your time))?[.!]*$/i.test(lastSentence.trim())) score -= 16
  if (/thank you/i.test(lastSentence) && lastWords < 45) score -= 4
  if (lastWords >= 25 && lastWords <= 90) score += 6
  else if (lastWords > 0 && lastWords < 15) score -= 8
  else if (lastWords > 110) score -= 4

  return clamp(score + variance(`${seed}|conclusion`, 3), 32, 97)
}

function openingImprovement(sentences: string[]): string {
  const first = sentences[0] ?? ''
  if (
    /^(today|hi|hello|good (morning|afternoon|evening)|i want to talk about|i'd like to talk about|in this (speech|talk))/i.test(
      first.trim(),
    )
  ) {
    return 'Replace the opening announcement with a concrete image or question. The first line should make the room lean in, not tell it what to expect.'
  }
  return 'Sharpen the first two sentences into one image or question under fifteen words. You have roughly ten seconds before attention drifts.'
}

function clarityImprovement(fillers: string[], averageSentence: number): string {
  if (fillers.length > 0) {
    const list = fillers
      .slice(0, 3)
      .map((filler) => `“${filler}”`)
      .join(', ')
    return `Cut hedging and filler — ${list} — from the draft. Each phrase softens the sentence it sits inside.`
  }
  if (averageSentence > 24) {
    return `Long sentences dominate (roughly ${Math.round(averageSentence)} words on average). Split the heaviest ones so the average sits between 14 and 20 words.`
  }
  return 'Tighten two sentences that only restate the point. At speaking pace, listeners cannot re-read a line.'
}

function structureImprovement(paragraphCount: number, connectorCount: number): string {
  if (paragraphCount <= 2) {
    return 'Break the draft into four or five paragraphs, each carrying one idea, so the argument has visible steps.'
  }
  if (connectorCount < 3) {
    return 'Add signposts at each turn — “First…”, “Which brings me to…”, “So here is what matters” — so the audience can track the argument.'
  }
  return 'Give the middle one clear turn: name the problem, then name the change. A single signposting sentence before each shift is enough.'
}

function engagementImprovement(hasDirectAddress: boolean, hasStory: boolean): string {
  if (!hasDirectAddress) {
    return 'Bring the listener into the draft. Replace one abstract statement with “Think about the last time you…”.'
  }
  if (!hasStory) {
    return 'Insert a thirty-second personal scene. Specific moments are what audiences repeat afterwards.'
  }
  return 'Add one example your audience will recognise from their own week. Familiar detail keeps attention on the argument.'
}

function conclusionImprovement(lastParagraph: string): string {
  if (/thank you/i.test(lastParagraph)) {
    return 'Drop the closing thank-you from the script. End on the ask; the applause is your thank-you.'
  }
  return 'End with a single, concrete action the audience can take this week. One ask lands better than three.'
}

export function analyseSpeech(draft: SpeechDraft): Analysis {
  const text = draft.text.trim()
  const lower = text.toLowerCase()
  const words = text.match(/[A-Za-z'’-]+/g) ?? []
  const wordCount = countWords(text)
  const sentences = splitSentences(text)
  const paragraphs = splitParagraphs(text)
  const fillers = findFillers(text)
  const questionCount = countMatches(text, /\?/g)
  const youCount = countMatches(lower, /\b(you|your|yours|yourself)\b/g)
  const seed = `${lower}|${draft.audience}|${draft.goal}`
  const averageSentence = sentences.length ? words.length / sentences.length : 0
  const connectorCount = countMatches(
    text,
    /\b(first|second|third|next|then|finally|however|therefore|because|so|which brings me|as a result|in contrast|more importantly)\b/gi,
  )

  const rawScores: Record<ScoreKey, number> = {
    openingHook: openingScore(sentences, seed),
    clarity: clarityScore(words, sentences.length, fillers.length, seed),
    structure: structureScore(paragraphs, text, sentences.length, seed),
    engagement: engagementScore(text, wordCount, youCount, questionCount, draft.audience, draft.goal, seed),
    conclusion: conclusionScore(paragraphs, text, seed),
  }

  const scores: ScoreDetail[] = (Object.keys(LABELS) as ScoreKey[]).map((key) => ({
    key,
    label: LABELS[key],
    score: rawScores[key],
    note: noteFor(key, rawScores[key]),
  }))

  const overall = Math.round(scores.reduce((total, score) => total + score.score, 0) / scores.length)
  const sorted = [...scores].sort((a, b) => b.score - a.score)
  const strongest = sorted[0]
  const weakest = sorted[sorted.length - 1]

  const strengthSet = new Set<string>()
  for (const score of sorted) {
    if (score.score >= 72 && strengthSet.size < 2) strengthSet.add(STRENGTH_BY_KEY[score.key])
  }
  if (/\b\d[\d,.]*\b/.test(text)) {
    strengthSet.add('At least one claim is anchored by a concrete number, which makes the argument easier to trust.')
  }
  if (/\b(when i|last year|one day|remember)\b/i.test(lower)) {
    strengthSet.add('A personal detail gives the talk a human entry point that audiences remember.')
  }
  for (const fallback of FALLBACK_STRENGTHS) {
    if (strengthSet.size >= 3) break
    strengthSet.add(fallback)
  }
  const strengths = [...strengthSet].slice(0, 3)

  const weaknesses: string[] = []
  for (const score of [...scores].sort((a, b) => a.score - b.score)) {
    if (score.score < 78 && weaknesses.length < 2) weaknesses.push(WEAKNESS_BY_KEY[score.key])
  }
  for (const fallback of FALLBACK_WEAKNESSES) {
    if (weaknesses.length >= 2) break
    weaknesses.push(fallback)
  }

  const lastParagraph = paragraphs[paragraphs.length - 1] ?? text
  const improvementCandidates: Record<ScoreKey, string> = {
    openingHook: openingImprovement(sentences),
    clarity: clarityImprovement(fillers, averageSentence),
    structure: structureImprovement(paragraphs.length, connectorCount),
    engagement: engagementImprovement(youCount > 0, /\b(when i|last year|one day|remember|i used to|my first)\b/i.test(text)),
    conclusion: conclusionImprovement(lastParagraph),
  }

  const improvements: string[] = []
  const addImprovement = (value: string) => {
    if (improvements.length < 5 && !improvements.includes(value)) improvements.push(value)
  }

  for (const score of [...scores].sort((a, b) => a.score - b.score)) {
    addImprovement(improvementCandidates[score.key])
  }
  if (!/\b\d[\d,.]*\b/.test(text)) {
    addImprovement('Anchor the central claim with one number or dated example. Specificity is what makes a claim credible.')
  }
  if (wordCount < 140) {
    addImprovement('At this length there is little room to build. Develop the middle with one concrete example before the close.')
  }
  if (wordCount > 700) {
    addImprovement('Trim toward 500–600 words — roughly four minutes — and cut anything that does not serve the central claim.')
  }
  const goalImprovement: Record<Goal, string> = {
    Inform: 'Preview your three key points before the first detail so listeners can file what follows.',
    Persuade: 'Name the objection your audience will raise, then answer it in a single line.',
    Inspire: 'Raise the emotional stakes in the final third: say what becomes possible if the audience acts.',
    Entertain: 'Give the audience an early laugh or surprise to signal the tone you are playing for.',
  }
  addImprovement(goalImprovement[draft.goal])
  const fallbackImprovements = [
    'Read the final draft aloud once and mark every place you run out of breath; those are your sentence breaks.',
    'Move the strongest sentence from the middle into the first fifteen seconds. Open with your best line, not your setup.',
  ]
  for (const fallback of fallbackImprovements) {
    if (improvements.length >= 4) break
    addImprovement(fallback)
  }

  const deliveryTips: string[] = [AUDIENCE_TIP[draft.audience]]
  const tipPool = [...BASE_DELIVERY_TIPS]
  const seededIndex = hashString(seed) % tipPool.length
  for (let offset = 0; offset < 2; offset += 1) {
    deliveryTips.push(tipPool[(seededIndex + offset * 3) % tipPool.length])
  }
  deliveryTips.push(GOAL_TIP[draft.goal])
  const uniqueTips = [...new Set(deliveryTips)]

  return {
    title: draft.title.trim(),
    audience: draft.audience,
    goal: draft.goal,
    wordCount,
    overall,
    verdict: verdictFor(overall),
    summary: `${strongest.label} is the strongest dimension at ${strongest.score}/100; ${weakest.label.toLowerCase()} is the weakest at ${weakest.score}/100. The suggestions below are ordered to fix the lowest scores first.`,
    scores,
    strengths,
    weaknesses,
    improvements,
    deliveryTips: uniqueTips,
    generatedAt: new Date().toISOString(),
  }
}
