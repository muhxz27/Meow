import type { Analysis } from '../types'

export interface ReportScore {
  dimension: string
  score: number
}

export interface ReportPayload {
  source: 'PitchPerfect AI'
  reportType: 'speech-analysis-demo'
  generatedAt: string
  recipientEmail: string | null
  speechTitle: string
  audience: string
  goal: string
  wordCount: number
  overallScore: number
  scores: ReportScore[]
  strengths: string[]
  improvements: string[]
  disclaimer: string
}

export type ReportErrorKind = 'config' | 'validation' | 'network' | 'timeout' | 'response'

export class ReportError extends Error {
  kind: ReportErrorKind

  constructor(kind: ReportErrorKind, message: string) {
    super(message)
    this.name = 'ReportError'
    this.kind = kind
  }
}

export function getWebhookUrl(): string {
  return (import.meta.env.VITE_MAKE_WEBHOOK_URL ?? '').trim()
}

export function isWebhookConfigured(url: string): boolean {
  return /^https:\/\/\S+$/i.test(url) && !/your-webhook|example\.com/i.test(url)
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

// Deliberately excludes the speech body: only report metadata leaves the browser.
export function buildReportPayload(analysis: Analysis, recipientEmail: string): ReportPayload {
  return {
    source: 'PitchPerfect AI',
    reportType: 'speech-analysis-demo',
    generatedAt: analysis.generatedAt,
    recipientEmail: recipientEmail.trim() ? recipientEmail.trim() : null,
    speechTitle: analysis.title,
    audience: analysis.audience,
    goal: analysis.goal,
    wordCount: analysis.wordCount,
    overallScore: analysis.overall,
    scores: analysis.scores.map(({ label, score }) => ({ dimension: label, score })),
    strengths: analysis.strengths,
    improvements: analysis.improvements,
    disclaimer:
      'Demo analysis produced by a fixed rubric; no AI was used. The speech text is intentionally not included in this report.',
  }
}

export async function sendReport(
  webhookUrl: string,
  payload: ReportPayload,
  timeoutMs = 15000,
): Promise<void> {
  if (!isWebhookConfigured(webhookUrl)) {
    throw new ReportError(
      'config',
      'Email reports are not configured. Add a valid https:// Make.com webhook URL to VITE_MAKE_WEBHOOK_URL (see the README), then rebuild or restart the dev server.',
    )
  }

  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new ReportError(
        'response',
        `The webhook responded with HTTP ${response.status}. Check that the Make.com scenario is active and accepts JSON.`,
      )
    }
  } catch (error) {
    if (error instanceof ReportError) throw error
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ReportError(
        'timeout',
        'The request timed out after 15 seconds. Your scenario may be paused, or the network blocked the request.',
      )
    }
    throw new ReportError(
      'network',
      'Could not reach the webhook. Check the URL, your connection, and that the Make.com scenario accepts requests from this origin.',
    )
  } finally {
    window.clearTimeout(timer)
  }
}
