import { useState } from 'react'
import type { Analysis } from '../types'
import {
  ReportError,
  buildReportPayload,
  getWebhookUrl,
  isWebhookConfigured,
  isValidEmail,
  sendReport,
} from '../lib/email'
import { buttonClass, cn } from '../lib/ui'

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function EmailReport({ analysis }: { analysis: Analysis }) {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const webhookUrl = getWebhookUrl()
  const configured = isWebhookConfigured(webhookUrl)
  const sending = status === 'sending'

  const handleSubmit = async () => {
    if (sending) return
    setEmailError('')
    setStatus('idle')
    setMessage('')

    if (email.trim() && !isValidEmail(email)) {
      setEmailError('Enter a valid email address, or leave the field blank.')
      setStatus('error')
      setMessage('The email address looks incomplete.')
      return
    }

    setStatus('sending')
    try {
      await sendReport(webhookUrl, buildReportPayload(analysis, email))
      setStatus('success')
      setMessage(
        'Report sent to your Make.com webhook. Delivery depends on the email module in your scenario.',
      )
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof ReportError
          ? error.message
          : 'Something went wrong while sending the report. Please try again.',
      )
    }
  }

  return (
    <section id="email-report" className="card overflow-hidden">
      <div className="border-b border-ink/[0.06] bg-accent/[0.04] p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent text-white">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
              <path
                d="M3.5 7.5A2.5 2.5 0 0 1 6 5h12a2.5 2.5 0 0 1 2.5 2.5v9A2.5 2.5 0 0 1 18 19H6a2.5 2.5 0 0 1-2.5-2.5v-9Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <h2 className="font-serif text-2xl tracking-tight text-ink">Email this report</h2>
            <p className="mt-1.5 max-w-xl text-sm leading-6 text-ink/65">
              Send the speech title, five scores, strengths and improvement suggestions through your
              Make.com scenario. The speech itself is never included.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void handleSubmit()
          }}
          noValidate
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
          aria-busy={sending}
        >
          <div className="flex-1">
            <label htmlFor="report-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-ink/50">
              Send to <span className="font-normal normal-case tracking-normal text-ink/40">(optional)</span>
            </label>
            <input
              id="report-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (emailError) setEmailError('')
              }}
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? 'report-email-error' : 'report-email-hint'}
              placeholder="you@example.com"
              disabled={sending}
              className={cn('field', emailError && 'border-rose/50 focus:border-rose focus:ring-rose/10')}
            />
            <p id="report-email-hint" className="mt-2 text-xs text-ink/45">
              Leave blank to use the recipient configured inside Make.com.
            </p>
            {emailError && (
              <p id="report-email-error" className="mt-1 text-xs font-medium text-rose">
                {emailError}
              </p>
            )}
          </div>

          <button type="submit" disabled={sending} className={cn(buttonClass('primary', 'md'), 'sm:mb-6')}>
            {sending ? (
              <>
                <span className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                Email report
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-3.5">
                  <path d="M3 10h13M11.5 5.5 16 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="mt-5 space-y-3">
          {!configured && status !== 'error' && (
            <p className="rounded-2xl border border-amber/20 bg-amber/[0.07] px-4 py-3 text-xs leading-5 text-ink/65">
              <span className="font-semibold text-ink">Setup needed:</span> email reports use a
              Make.com webhook. Add your URL to <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px]">VITE_MAKE_WEBHOOK_URL</code>{' '}
              in <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px]">.env.local</code>, then
              restart the dev server or redeploy. See the README for the full payload and scenario steps.
            </p>
          )}

          {status === 'success' && (
            <p role="status" className="flex gap-2.5 rounded-2xl border border-moss/20 bg-moss/[0.07] px-4 py-3 text-sm leading-6 text-ink/75">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-moss">
                <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="m6.5 10.2 2.4 2.4 4.6-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {message}
            </p>
          )}

          {status === 'error' && (
            <p role="alert" className="flex gap-2.5 rounded-2xl border border-rose/20 bg-rose/[0.06] px-4 py-3 text-sm leading-6 text-ink/75">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-rose">
                <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M10 6v5M10 14h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              {message}
            </p>
          )}
        </div>

        <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-ink/45">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="mt-0.5 size-3.5 shrink-0">
            <rect x="4.5" y="8.5" width="11" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 8.5V6.8a3 3 0 1 1 6 0v1.7" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Only report metadata leaves this browser: your title, selected audience and goal, word count,
          scores, strengths and suggestions. Never the full speech text.
        </p>
      </div>
    </section>
  )
}
