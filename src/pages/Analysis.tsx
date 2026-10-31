import { Link } from 'react-router-dom'
import EmailReport from '../components/EmailReport'
import ScoreRing from '../components/ScoreRing'
import { useSpeech } from '../context/SpeechContext'
import { formatDate, formatSpeakingTime } from '../lib/text'
import { buttonClass, cn, scoreTone } from '../lib/ui'

function EmptyAnalysis() {
  return (
    <div className="container-page animate-rise py-20">
      <div className="card mx-auto max-w-lg p-9 text-center sm:p-12">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6">
            <path d="M5 19V12M12 19V5M19 19v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M3.5 19h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        <h1 className="mt-6 text-3xl font-medium tracking-tight text-ink">No analysis yet</h1>
        <p className="mt-3 text-sm leading-6 text-ink/60">
          Write or paste a speech of at least 50 words, pick the audience and goal, and run the
          scorecard. The report will appear here.
        </p>
        <Link to="/workspace" className={cn(buttonClass('primary', 'md'), 'mt-7')}>
          Go to the workspace
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
            <path d="M4 10h11M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default function AnalysisPage() {
  const { result } = useSpeech()

  if (!result) return <EmptyAnalysis />

  const { analysis } = result

  return (
    <div className="container-page animate-rise py-10 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/workspace"
          className="inline-flex items-center gap-1.5 rounded-full py-1 text-xs font-semibold text-ink/55 transition hover:text-ink"
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-3.5">
            <path d="M16 10H5M9 5.5 4.5 10 9 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to workspace
        </Link>
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.06] px-3 py-1.5 text-[11px] font-semibold text-accent">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          Demo analysis · curated feedback
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">Speech report</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-medium leading-[1.08] tracking-[-0.015em] text-ink sm:text-5xl">
            {analysis.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="chip">{analysis.audience}</span>
            <span className="chip">Goal · {analysis.goal}</span>
            <span className="chip">{analysis.wordCount} words</span>
            <span className="chip">≈ {formatSpeakingTime(analysis.wordCount)} at 140 wpm</span>
            <span className="chip">{formatDate(analysis.generatedAt)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link to="/workspace" className={buttonClass('secondary', 'md')}>
            Edit draft
          </Link>
          <Link to="/revision" className={buttonClass('primary', 'md')}>
            Revise speech
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
              <path d="M4 10h11M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      <section className="card relative mt-8 overflow-hidden p-6 sm:p-8" aria-labelledby="overall-heading">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-accent/[0.07] blur-3xl"
        />
        <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:gap-9">
          <ScoreRing score={analysis.overall} size={150} strokeWidth={10} />
          <div className="flex-1">
            <p id="overall-heading" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/40">
              Overall score
            </p>
            <h2 className="mt-2 max-w-2xl font-serif text-[26px] leading-tight text-ink sm:text-[30px]">
              {analysis.verdict}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/60">{analysis.summary}</p>
            <p className="mt-4 text-[11px] text-ink/40">
              Equal weighting across five dimensions · fixed demo rubric, no AI model
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6" aria-labelledby="scores-heading">
        <h2 id="scores-heading" className="sr-only">
          Scores by dimension
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {analysis.scores.map((score, index) => {
            const tone = scoreTone(score.score)
            return (
              <article
                key={score.key}
                className={cn('card p-5', index < 3 ? 'lg:col-span-2' : 'lg:col-span-3')}
              >
                <div className="flex items-center gap-4">
                  <ScoreRing score={score.score} size={72} strokeWidth={6} />
                  <div>
                    <h3 className="text-[13.5px] font-semibold leading-snug text-ink">{score.label}</h3>
                    <span
                      className={cn(
                        'mt-1.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]',
                        tone.surface,
                        tone.text,
                      )}
                    >
                      {tone.label}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-5 text-ink/55">{score.note}</p>
              </article>
            )
          })}
        </div>
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="card p-6 sm:p-7" aria-labelledby="strengths-heading">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-moss/10 text-moss">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-[18px]">
                <path d="m4 10.5 3.5 3.5 8.5-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 id="strengths-heading" className="font-serif text-[23px] text-ink">
              What is working
            </h2>
          </div>
          <ul className="mt-5 space-y-3.5">
            {analysis.strengths.map((strength) => (
              <li key={strength} className="flex gap-3 text-sm leading-6 text-ink/70">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-moss" aria-hidden="true" />
                {strength}
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-6 sm:p-7" aria-labelledby="weaknesses-heading">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-amber/10 text-amber">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-[18px]">
                <path d="M10 3.8 17 16H3L10 3.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M10 8v3.4M10 13.6h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </span>
            <h2 id="weaknesses-heading" className="font-serif text-[23px] text-ink">
              Where it loses the room
            </h2>
          </div>
          <ul className="mt-5 space-y-3.5">
            {analysis.weaknesses.map((weakness) => (
              <li key={weakness} className="flex gap-3 text-sm leading-6 text-ink/70">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber" aria-hidden="true" />
                {weakness}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="card p-6 sm:p-7" aria-labelledby="improvements-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-accent/10 text-accent">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-[18px]">
                  <path d="M4 5h12M4 10h8M4 15h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <h2 id="improvements-heading" className="font-serif text-[23px] text-ink">
                Improvement plan
              </h2>
            </div>
            <span className="chip">{analysis.improvements.length} suggested edits</span>
          </div>
          <ol className="mt-5 space-y-4">
            {analysis.improvements.map((improvement, index) => (
              <li key={improvement} className="flex gap-3.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-[11px] font-semibold text-white">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-ink/70">{improvement}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="card p-6 sm:p-7" aria-labelledby="tips-heading">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-ink/[0.05] text-ink">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-[18px]">
                <rect x="7" y="2.8" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.6" />
                <path d="M4.5 9.5a5.5 5.5 0 0 0 11 0M10 15v2.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <h2 id="tips-heading" className="font-serif text-[23px] text-ink">
              Delivery tips
            </h2>
          </div>
          <ul className="mt-5 space-y-3.5">
            {analysis.deliveryTips.map((tip) => (
              <li key={tip} className="flex gap-3 text-sm leading-6 text-ink/70">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent/70" aria-hidden="true" />
                {tip}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-5">
        <EmailReport analysis={analysis} />
      </div>

      <p className="mt-6 flex items-start gap-2 text-xs leading-5 text-ink/40">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="mt-0.5 size-3.5 shrink-0">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10 9v4.5M10 6.5h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        Every score and comment on this page is demo/sample feedback produced by a fixed rubric in your
        browser. No AI service was called and your speech was not uploaded.
      </p>
    </div>
  )
}
