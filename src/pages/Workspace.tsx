import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSpeech } from '../context/SpeechContext'
import { AUDIENCES, GOALS, type Audience, type Goal } from '../types'
import { SAMPLE_SPEECH, SAMPLE_TITLE } from '../lib/sampleSpeech'
import { MIN_WORDS, countWords, formatSpeakingTime } from '../lib/text'
import { hasDraftErrors, validateDraft, type DraftErrors } from '../lib/validation'
import { buttonClass, cn } from '../lib/ui'

const AUDIENCE_DETAILS: Record<Audience, string> = {
  General: 'A mixed room with no shared context.',
  Students: 'Campus audience, peer-to-peer energy.',
  Professionals: 'Workplace room, outcomes first.',
  Judges: 'A scored event with a rubric in hand.',
}

const GOAL_DETAILS: Record<Goal, string> = {
  Inform: 'Leave them understanding something new.',
  Persuade: 'Move them to agree or act.',
  Inspire: 'Raise ambition and belief.',
  Entertain: 'Earn laughs and hold attention.',
}

export default function Workspace() {
  const { draft, result, updateDraft, analyse } = useSpeech()
  const navigate = useNavigate()
  const [errors, setErrors] = useState<DraftErrors>({})
  const [confirmSample, setConfirmSample] = useState(false)
  const [sampleNotice, setSampleNotice] = useState('')
  const titleRef = useRef<HTMLInputElement>(null)
  const textRef = useRef<HTMLTextAreaElement>(null)

  const wordCount = countWords(draft.text)
  const ready = wordCount >= MIN_WORDS
  const remaining = Math.max(0, MIN_WORDS - wordCount)
  const progress = Math.min(100, (wordCount / MIN_WORDS) * 100)

  const loadSample = () => {
    updateDraft({
      title: SAMPLE_TITLE,
      text: SAMPLE_SPEECH,
      audience: 'Students',
      goal: 'Persuade',
    })
    setErrors({})
    setConfirmSample(false)
    setSampleNotice('Sample speech loaded. Edit it freely, or analyse it as it stands.')
    textRef.current?.focus()
  }

  const requestSample = () => {
    if (countWords(draft.text) > 0) {
      setConfirmSample(true)
    } else {
      loadSample()
    }
  }

  const handleAnalyse = () => {
    const nextErrors = validateDraft(draft)
    setErrors(nextErrors)
    if (hasDraftErrors(nextErrors)) {
      if (nextErrors.title) titleRef.current?.focus()
      else textRef.current?.focus()
      return
    }
    analyse()
    navigate('/analysis')
  }

  return (
    <div className="container-page animate-rise py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">Workspace</p>
          <h1 className="mt-3 text-4xl font-medium tracking-[-0.015em] text-ink sm:text-5xl">
            Shape your next speech.
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-7 text-ink/60">
            Paste a draft or load the sample, choose the room and the goal, then let the scorecard find
            what is working and what is not.
          </p>
        </div>
        <span className="chip">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          Demo feedback · no AI
        </span>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.55fr_1fr] lg:items-start">
        <section className="card p-6 sm:p-8" aria-labelledby="draft-heading">
          <h2 id="draft-heading" className="sr-only">
            Your draft
          </h2>

          <div>
            <label htmlFor="speech-title" className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/50">
              Speech title
            </label>
            <input
              ref={titleRef}
              id="speech-title"
              type="text"
              value={draft.title}
              maxLength={120}
              onChange={(event) => {
                updateDraft({ title: event.target.value })
                if (errors.title) setErrors((current) => ({ ...current, title: undefined }))
              }}
              placeholder="e.g. Why every student should learn to speak up"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'title-error' : 'title-hint'}
              className={cn('field mt-2', errors.title && 'border-rose/50 focus:border-rose focus:ring-rose/10')}
            />
            <div className="mt-1.5 flex items-start justify-between gap-3">
              {errors.title ? (
                <p id="title-error" role="alert" className="text-xs font-medium text-rose">
                  {errors.title}
                </p>
              ) : (
                <p id="title-hint" className="text-xs text-ink/40">
                  A working title is fine — you can change it later.
                </p>
              )}
              <span className="shrink-0 text-[11px] tabular-nums text-ink/35">{draft.title.length}/120</span>
            </div>
          </div>

          <div className="mt-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="speech-text" className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/50">
                Speech text
              </label>
              <button
                type="button"
                onClick={requestSample}
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold text-accent transition hover:bg-accent/[0.07] hover:text-accent-deep"
              >
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-3.5">
                  <path d="M10 3.5v9M6.5 9 10 12.5 13.5 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 15.5h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
                Load sample speech
              </button>
            </div>

            {confirmSample && (
              <div
                role="alertdialog"
                aria-labelledby="sample-confirm-text"
                className="mt-3 rounded-2xl border border-amber/25 bg-amber/[0.06] p-4"
              >
                <p id="sample-confirm-text" className="text-sm leading-6 text-ink/75">
                  Replace your current draft ({wordCount} {wordCount === 1 ? 'word' : 'words'}) with the
                  sample speech?
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={loadSample} className={buttonClass('primary', 'sm')}>
                    Replace draft
                  </button>
                  <button type="button" onClick={() => setConfirmSample(false)} className={buttonClass('secondary', 'sm')}>
                    Keep my draft
                  </button>
                </div>
              </div>
            )}

            <textarea
              ref={textRef}
              id="speech-text"
              value={draft.text}
              onChange={(event) => {
                updateDraft({ text: event.target.value })
                if (errors.text) setErrors((current) => ({ ...current, text: undefined }))
              }}
              placeholder="Start with the line you want the room to remember…"
              aria-invalid={Boolean(errors.text)}
              aria-describedby={errors.text ? 'text-error' : 'word-meter'}
              className={cn(
                'field mt-3 min-h-[340px] resize-y leading-7',
                errors.text && 'border-rose/50 focus:border-rose focus:ring-rose/10',
              )}
            />

            {errors.text && (
              <p id="text-error" role="alert" className="mt-2 text-xs font-medium text-rose">
                {errors.text}
              </p>
            )}

            <div id="word-meter" className="mt-3 rounded-2xl border border-ink/[0.06] bg-paper/70 px-4 py-3.5">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs">
                <span className={cn('font-semibold tabular-nums', ready ? 'text-moss' : 'text-ink/65')}>
                  {wordCount} {wordCount === 1 ? 'word' : 'words'}
                </span>
                <span className="text-ink/45">≈ {formatSpeakingTime(wordCount)} at 140 wpm</span>
                <span className={cn('font-medium', ready ? 'text-moss' : 'text-ink/45')}>
                  {ready ? `Minimum reached (${MIN_WORDS} words)` : `${remaining} more to reach ${MIN_WORDS}`}
                </span>
              </div>
              <div
                className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-ink/[0.06]"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={MIN_WORDS}
                aria-valuenow={Math.min(wordCount, MIN_WORDS)}
                aria-label="Words toward the 50-word minimum"
              >
                <div
                  className={cn('h-full rounded-full transition-[width,background-color] duration-500', ready ? 'bg-moss' : 'bg-accent')}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {sampleNotice && (
              <p role="status" className="mt-3 flex items-center gap-2 text-xs text-moss">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
                  <path d="m5 10.5 3.2 3.2L15.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {sampleNotice}
              </p>
            )}
          </div>
        </section>

        <div className="space-y-5 lg:sticky lg:top-24">
          <section className="card p-6" aria-labelledby="audience-heading">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="audience-heading" className="font-serif text-[22px] text-ink">
                Audience
              </h2>
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/35">Who's listening</span>
            </div>
            <div role="group" aria-labelledby="audience-heading" className="mt-4 grid grid-cols-2 gap-2.5">
              {AUDIENCES.map((audience) => {
                const active = draft.audience === audience
                return (
                  <button
                    key={audience}
                    type="button"
                    aria-pressed={active}
                    onClick={() => updateDraft({ audience })}
                    className={cn(
                      'rounded-2xl border p-3 text-left transition',
                      active
                        ? 'border-accent/60 bg-accent/[0.06] shadow-[inset_0_0_0_1px_rgba(91,61,245,0.18)]'
                        : 'border-ink/10 bg-white hover:border-ink/25 hover:bg-ink/[0.02]',
                    )}
                  >
                    <span className="flex items-center justify-between gap-1 text-[13px] font-semibold text-ink">
                      {audience}
                      {active && (
                        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-3.5 text-accent">
                          <path d="m4.5 10.5 3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="mt-1 block text-[11px] leading-4 text-ink/50">{AUDIENCE_DETAILS[audience]}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="card p-6" aria-labelledby="goal-heading">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="goal-heading" className="font-serif text-[22px] text-ink">
                Goal
              </h2>
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/35">What it should do</span>
            </div>
            <div role="group" aria-labelledby="goal-heading" className="mt-4 grid grid-cols-2 gap-2.5">
              {GOALS.map((goal) => {
                const active = draft.goal === goal
                return (
                  <button
                    key={goal}
                    type="button"
                    aria-pressed={active}
                    onClick={() => updateDraft({ goal })}
                    className={cn(
                      'rounded-2xl border p-3 text-left transition',
                      active
                        ? 'border-accent/60 bg-accent/[0.06] shadow-[inset_0_0_0_1px_rgba(91,61,245,0.18)]'
                        : 'border-ink/10 bg-white hover:border-ink/25 hover:bg-ink/[0.02]',
                    )}
                  >
                    <span className="flex items-center justify-between gap-1 text-[13px] font-semibold text-ink">
                      {goal}
                      {active && (
                        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-3.5 text-accent">
                          <path d="m4.5 10.5 3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="mt-1 block text-[11px] leading-4 text-ink/50">{GOAL_DETAILS[goal]}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-serif text-[22px] text-ink">Ready when you are</h2>
            <p className="mt-2 text-xs leading-5 text-ink/55">
              Scored against a fixed five-dimension rubric. Every result is demo feedback, clearly labelled.
            </p>
            <button type="button" onClick={handleAnalyse} className={cn(buttonClass('primary', 'lg'), 'mt-5 w-full')}>
              Analyse my speech
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
                <path d="M4 10h11M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {result && (
              <Link
                to="/analysis"
                className="mt-3 flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold text-accent transition hover:text-accent-deep"
              >
                View previous analysis
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-3">
                  <path d="M4 10h11M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}

            <div className="mt-5 flex items-start gap-2 border-t border-ink/[0.06] pt-4 text-[11px] leading-5 text-ink/40">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="mt-0.5 size-3.5 shrink-0">
                <rect x="4.5" y="8.5" width="11" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 8.5V6.8a3 3 0 1 1 6 0v1.7" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Kept in this browser tab only. No account, database or upload.
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
