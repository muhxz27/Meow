export const AUDIENCES = ['General', 'Students', 'Professionals', 'Judges'] as const
export type Audience = (typeof AUDIENCES)[number]

export const GOALS = ['Inform', 'Persuade', 'Inspire', 'Entertain'] as const
export type Goal = (typeof GOALS)[number]

export type ScoreKey = 'openingHook' | 'clarity' | 'structure' | 'engagement' | 'conclusion'

export interface SpeechDraft {
  title: string
  text: string
  audience: Audience
  goal: Goal
}

export interface ScoreDetail {
  key: ScoreKey
  label: string
  score: number
  note: string
}

export interface Analysis {
  title: string
  audience: Audience
  goal: Goal
  wordCount: number
  overall: number
  verdict: string
  summary: string
  scores: ScoreDetail[]
  strengths: string[]
  weaknesses: string[]
  improvements: string[]
  deliveryTips: string[]
  generatedAt: string
}

export interface RevisionResult {
  text: string
  note: string
}

export interface AnalysisResult {
  analysis: Analysis
  revision: RevisionResult
  input: SpeechDraft
}
