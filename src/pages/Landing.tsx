import { Link } from 'react-router-dom'
import ScoreRing from '../components/ScoreRing'
import { buttonClass, cn, scoreTone } from '../lib/ui'

const FEATURES = [
  {
    number: '01',
    title: 'A five-dimension scorecard',
    copy:
      'Opening hook, clarity, structure, audience engagement and conclusion, each scored out of 100 with a one-line diagnosis you can act on.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
        <path d="M5 19V12M12 19V5M19 19v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M3.5 19h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Tailored to the room',
    copy:
      'Tell the workspace who is listening and what the talk should do. Audience and goal shape the feedback, the improvements and the delivery tips.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
        <circle cx="9" cy="8.5" r="3" stroke="currentColor" strokeWidth="1.7" />
        <path d="M3.5 19c.6-3 2.8-4.7 5.5-4.7s4.9 1.7 5.5 4.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M15.5 9.5h5M18 7v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'A revision you can steal',
    copy:
      'See your original beside a stronger model version, with the reasoning spelled out. Copy the revision in one click and make it sound like you.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
        <path d="M4 16.5V20h3.5L19 8.5 15.5 5 4 16.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="m13.8 6.7 3.5 3.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M4 4h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Reports in your inbox',
    copy:
      'Send the scores, strengths and next steps through a Make.com webhook — perfect for saving a rehearsal log. Your speech text never leaves the page.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
        <path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h12a2.5 2.5 0 0 1 2.5 2.5v9A2.5 2.5 0 0 1 18 19H6a2.5 2.5 0 0 1-2.5-2.5v-9Z" stroke="currentColor" strokeWidth="1.7" />
        <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '05',
    title: 'Private by default',
    copy:
      'No account, no database, no AI API. Drafts and results live in this browser tab, and the demo is labelled as a demo everywhere it counts.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
        <path d="M12 3.5 19 6v5.5c0 4.3-2.8 7.6-7 9-4.2-1.4-7-4.7-7-9V6l7-2.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="m9 12 2.2 2.2L15.5 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const STEPS = [
  {
    title: 'Write or load a draft',
    copy:
      'Paste your speech, or start from the sample. Choose the audience and the goal so the feedback knows what the talk is trying to do.',
  },
  {
    title: 'Read the five scores',
    copy:
      'See where the draft earns attention and where it loses the room. Every dimension comes with a short diagnosis, not a vague percentage.',
  },
  {
    title: 'Revise, copy, send',
    copy:
      'Open the model revision, copy it with one click, and email the report as a record of the work. Then rehearse it out loud.',
  },
]

const PREVIEW_SCORES = [
  { label: 'Opening Hook', score: 82 },
  { label: 'Clarity', score: 74 },
  { label: 'Structure', score: 88 },
  { label: 'Audience Engagement', score: 69 },
  { label: 'Conclusion', score: 54 },
]

const DEMO_POINTS = [
  'A fixed, deterministic rubric — the same draft always earns the same scores.',
  'Feedback and revisions are written sample content, not live AI output.',
  'Email reports carry the title, scores, strengths and suggestions only.',
  'Drafts stay in this browser tab; there is no account, database or upload.',
]

function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[470px] animate-rise animation-delay-2">
      <div
        aria-hidden="true"
        className="absolute -inset-8 rounded-[3rem] bg-[radial-gradient(circle_at_30%_20%,rgba(91,61,245,0.16),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(255,189,150,0.35),transparent_60%)] blur-2xl"
      />
      <div className="relative -rotate-[1.5deg] rounded-[2rem] border border-ink/[0.08] bg-white/95 p-6 shadow-lift backdrop-blur transition-transform duration-500 hover:rotate-0 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-accent text-white">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4">
                <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/45">Analysis preview</span>
          </div>
          <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
            Demo
          </span>
        </div>

        <h2 className="mt-5 font-serif text-[22px] leading-tight text-ink">The Quiet Kid in the Back Row</h2>
        <p className="mt-1 text-xs text-ink/45">Students · Persuade · 259 words</p>

        <div className="mt-6 flex items-center gap-5">
          <ScoreRing score={73} size={104} strokeWidth={8} />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/40">Overall</p>
            <p className="mt-1.5 font-serif text-lg leading-snug text-ink">
              A solid foundation. The shape works; the opening and close need real work.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {PREVIEW_SCORES.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between text-[11px] font-medium">
                <span className="text-ink/60">{item.label}</span>
                <span className="text-ink/80">{item.score}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink/[0.06]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${item.score}%`, backgroundColor: scoreTone(item.score).stroke }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2 border-t border-ink/[0.06] pt-5">
          <span className="chip">5 dimensions</span>
          <span className="chip">Audience-aware</span>
          <span className="chip bg-white">No speech sent</span>
        </div>
      </div>

      <div className="absolute -bottom-14 left-2 hidden items-center gap-3 rounded-2xl border border-ink/[0.07] bg-white px-4 py-3 shadow-card sm:flex">
        <span className="grid size-8 place-items-center rounded-xl bg-amber/10 text-amber">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
            <path d="M10 3.5 17 16H3L10 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M10 8v3.5M10 13.7h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </span>
        <div>
          <p className="text-[11px] font-semibold text-ink">Filler phrases flagged</p>
          <p className="text-[11px] text-ink/50">basically · I guess · just</p>
        </div>
      </div>

      <div className="absolute -right-3 -top-5 hidden rounded-full border border-ink/[0.07] bg-white px-4 py-2 text-[11px] font-semibold text-ink shadow-card md:block">
        Revision ready to copy
      </div>
    </div>
  )
}

export default function Landing() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="animate-breathe absolute -top-40 right-[-12%] h-[540px] w-[540px] rounded-full bg-accent/10 blur-[110px]" />
          <div className="absolute left-[-18%] top-40 h-[420px] w-[420px] rounded-full bg-[#FFD9C2]/40 blur-[110px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(23,20,31,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(23,20,31,0.03)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        </div>

        <div className="container-page relative grid gap-16 pb-20 pt-14 lg:grid-cols-[1.03fr_0.97fr] lg:items-center lg:gap-12 lg:pb-28 lg:pt-20">
          <div className="max-w-xl animate-rise">
            <span className="chip">
              <span className="relative flex size-2" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/50" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              Speech analysis demo · no sign-up
            </span>

            <h1 className="mt-6 text-[2.9rem] font-medium leading-[1.02] tracking-[-0.02em] text-ink sm:text-6xl lg:text-[4.35rem]">
              Your words deserve a{' '}
              <em className="italic text-accent">standing ovation</em>.
            </h1>

            <p className="mt-6 max-w-lg text-[16.5px] leading-7 text-ink/65">
              PitchPerfect AI is a rehearsal studio for speakers. It scores your draft across five
              dimensions, shows you exactly what to fix, and hands you a stronger revision — without an
              account, an upload, or a black-box AI.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/workspace" className={buttonClass('primary', 'lg')}>
                Get Started
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
                  <path d="M4 10h11M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link to="/#features" className={buttonClass('secondary', 'lg')}>
                See how it scores
              </Link>
            </div>

            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-ink/55">
              {['Five scoring dimensions', 'Load a sample draft', 'Nothing leaves this tab'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4 text-accent">
                    <path d="m5 10.5 3.2 3.2L15.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <HeroPreview />
        </div>
      </section>

      <section id="features" className="scroll-mt-24 border-t border-ink/[0.06] py-20 sm:py-24">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">Features</p>
            <h2 className="mt-4 text-4xl font-medium leading-[1.08] tracking-[-0.015em] text-ink sm:text-5xl">
              Everything you need to rehearse with intent.
            </h2>
            <p className="mt-4 max-w-xl text-[15.5px] leading-7 text-ink/60">
              Five focused tools instead of a hundred vague tips. Each one is built around a single
              question: what would make this talk land harder in the room?
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
            {FEATURES.map((feature, index) => (
              <article
                key={feature.title}
                className={cn(
                  'group rounded-3xl border border-ink/[0.07] bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift',
                  index < 3 ? 'lg:col-span-2' : 'lg:col-span-3',
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-11 place-items-center rounded-2xl bg-accent/[0.08] text-accent transition group-hover:bg-accent group-hover:text-white">
                    {feature.icon}
                  </span>
                  <span className="font-serif text-sm text-ink/25">{feature.number}</span>
                </div>
                <h3 className="mt-6 font-serif text-[22px] leading-snug text-ink">{feature.title}</h3>
                <p className="mt-2.5 text-sm leading-6 text-ink/60">{feature.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-24 border-y border-ink/[0.06] bg-white/50 py-20 sm:py-24"
      >
        <div className="container-page">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow">How it works</p>
              <h2 className="mt-4 text-4xl font-medium leading-[1.08] tracking-[-0.015em] text-ink sm:text-5xl">
                From rough draft to a room that listens.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-ink/55">
              Three steps, no setup, no account. The whole analysis runs in your browser in under a
              second.
            </p>
          </div>

          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="relative rounded-3xl border border-ink/[0.07] bg-paper p-7 transition hover:border-accent/25 hover:bg-white"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-full bg-ink font-serif text-[15px] text-white">
                    {index + 1}
                  </span>
                  <span className="h-px w-14 bg-ink/10" aria-hidden="true" />
                </div>
                <h3 className="mt-6 font-serif text-[22px] leading-snug text-ink">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-6 text-ink/60">{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="demo" className="scroll-mt-24 py-20 sm:py-24">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[2rem] border border-ink/[0.07] bg-white p-7 shadow-card sm:p-12">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/[0.07] blur-3xl"
            />
            <div className="relative grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
              <div>
                <p className="eyebrow">Honest by design</p>
                <h2 className="mt-4 max-w-lg text-4xl font-medium leading-[1.08] tracking-[-0.015em] text-ink sm:text-[44px]">
                  No AI. No upload. Nothing to hide behind.
                </h2>
                <p className="mt-4 max-w-lg text-[15.5px] leading-7 text-ink/60">
                  This is a demonstration build. Scores come from a fixed rubric and every line of
                  coaching is curated sample content, so the experience is predictable and reviewable.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link to="/workspace" className={buttonClass('dark', 'md')}>
                    Try the sample speech
                  </Link>
                  <Link to="/#how-it-works" className={buttonClass('secondary', 'md')}>
                    Walk through the steps
                  </Link>
                </div>
                <p className="mt-6 font-serif text-lg italic text-ink/45">
                  “0 AI APIs · 5 scores · 4 audience presets”
                </p>
              </div>

              <div className="rounded-3xl border border-ink/[0.07] bg-paper p-6 sm:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/40">
                  What “demo” means here
                </p>
                <ul className="mt-4 space-y-4">
                  {DEMO_POINTS.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-6 text-ink/70">
                      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent">
                        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="m6.7 10.2 2.2 2.2 4.4-4.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-7 py-14 sm:px-14 sm:py-16">
            <div
              aria-hidden="true"
              className="absolute -left-20 -top-24 h-80 w-80 rounded-full bg-accent/40 blur-[100px]"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-accent/20 blur-[100px]"
            />
            <div className="relative max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                The next draft is the better one
              </p>
              <h2 className="mt-4 text-4xl font-medium leading-[1.05] tracking-[-0.015em] text-white sm:text-5xl">
                Ready to hear how your draft lands?
              </h2>
              <p className="mt-4 max-w-lg text-[15.5px] leading-7 text-white/60">
                Paste a speech, pick your room, and get a scorecard in seconds. Then walk into the
                rehearsal knowing exactly what to fix.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/workspace"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-paper"
                >
                  Get started
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
                    <path d="M4 10h11M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link
                  to="/#features"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-[15px] font-semibold text-white/85 transition hover:border-white/40 hover:text-white"
                >
                  Explore the features
                </Link>
              </div>
              <p className="mt-6 text-xs text-white/40">
                Free demo · no sign-up · your draft never leaves this browser tab
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
