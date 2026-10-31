import { Link } from 'react-router-dom'
import CopyButton from '../components/CopyButton'
import { useSpeech } from '../context/SpeechContext'
import { buttonClass, cn } from '../lib/ui'

function EmptyRevision() {
  return (
    <div className="container-page animate-rise py-20">
      <div className="card mx-auto max-w-lg p-9 text-center sm:p-12">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6">
            <path d="M4 16.5V20h3.5L19 8.5 15.5 5 4 16.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="m13.8 6.7 3.5 3.5" stroke="currentColor" strokeWidth="1.7" />
          </svg>
        </span>
        <h1 className="mt-6 text-3xl font-medium tracking-tight text-ink">No revision yet</h1>
        <p className="mt-3 text-sm leading-6 text-ink/60">
          Analyse a speech first. Once the scorecard exists, the revision studio pairs your original
          draft with a model revision you can copy.
        </p>
        <Link to="/workspace" className={cn(buttonClass('primary', 'md'), 'mt-7')}>
          Go to the workspace
        </Link>
      </div>
    </div>
  )
}

export default function RevisionPage() {
  const { result } = useSpeech()

  if (!result) return <EmptyRevision />

  const { analysis, revision, input } = result

  return (
    <div className="container-page animate-rise py-10 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/analysis"
          className="inline-flex items-center gap-1.5 rounded-full py-1 text-xs font-semibold text-ink/55 transition hover:text-ink"
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-3.5">
            <path d="M16 10H5M9 5.5 4.5 10 9 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to the report
        </Link>
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.06] px-3 py-1.5 text-[11px] font-semibold text-accent">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          Demo revision · sample content
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">Revision studio</p>
          <h1 className="mt-3 text-4xl font-medium leading-[1.08] tracking-[-0.015em] text-ink sm:text-5xl">
            See the draft, then see the difference.
          </h1>
          <p className="mt-3 text-[15px] leading-7 text-ink/60">
            For <span className="font-medium text-ink">“{analysis.title}”</span> · {analysis.audience} audience ·{' '}
            {analysis.goal.toLowerCase()} goal. Read your original beside a stronger model version, with the
            reasoning listed first.
          </p>
        </div>
        <CopyButton text={revision.text} className="shrink-0" />
      </div>

      <section className="card mt-8 p-6 sm:p-7" aria-labelledby="suggestions-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-accent/10 text-accent">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-[18px]">
                <path d="M4 5h12M4 10h8M4 15h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <h2 id="suggestions-heading" className="font-serif text-[23px] text-ink">
              Suggested improvements
            </h2>
          </div>
          <span className="chip">{analysis.improvements.length} edits to make</span>
        </div>
        <ol className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
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

      <div className="mt-5 grid gap-5 lg:grid-cols-2 lg:items-start">
        <section className="card flex flex-col overflow-hidden" aria-labelledby="original-heading">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/[0.06] bg-paper/60 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-ink/25" aria-hidden="true" />
              <h2 id="original-heading" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/55">
                Original draft
              </h2>
            </div>
            <span className="text-[11px] text-ink/40">{analysis.wordCount} words</span>
          </div>
          <div className="max-h-[58vh] overflow-y-auto px-6 py-6">
            <p className="copy-block text-ink/65">{input.text}</p>
          </div>
        </section>

        <section
          className="card flex flex-col overflow-hidden border-accent/15 ring-1 ring-accent/10"
          aria-labelledby="revision-heading"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-accent/10 bg-accent/[0.05] px-6 py-4">
            <div className="flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
              <h2 id="revision-heading" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent">
                Sample revision
              </h2>
            </div>
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent/80">
              Demo
            </span>
          </div>
          <div className="max-h-[58vh] overflow-y-auto bg-gradient-to-b from-white to-accent/[0.02] px-6 py-6">
            <p className="copy-block text-ink/85">{revision.text}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-ink/[0.06] bg-white px-6 py-4">
            <CopyButton text={revision.text} label="Copy revised speech" copiedLabel="Revised speech copied" />
            <Link to="/analysis" className={buttonClass('secondary', 'md')}>
              View the scores
            </Link>
          </div>
        </section>
      </div>

      <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-ink/45">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="mt-0.5 size-3.5 shrink-0">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10 9v4.5M10 6.5h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span>
          {revision.note} This is demonstration content, not a rewrite produced by AI.
        </span>
      </p>
    </div>
  )
}
