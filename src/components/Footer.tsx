import { Link } from 'react-router-dom'
import Logo from './Logo'

const PRODUCT_LINKS = [
  { to: '/workspace', label: 'Workspace' },
  { to: '/analysis', label: 'Analysis report' },
  { to: '/revision', label: 'Revision studio' },
]

const LEARN_LINKS = [
  { to: '/#features', label: 'Features' },
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/#demo', label: 'About the demo' },
]

export default function Footer() {
  return (
    <footer className="border-t border-ink/[0.07] bg-paper">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-ink/60">
              A rehearsal studio for speakers: score the draft, hear the truth, and leave with a
              stronger version of your own words.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-3 py-1.5 text-[11px] font-medium text-ink/55">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              Demo build — curated feedback, no AI APIs
            </p>
          </div>

          <div>
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45">
              Product
            </h2>
            <ul className="mt-4 space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-ink/65 transition hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45">
              Learn
            </h2>
            <ul className="mt-4 space-y-2.5">
              {LEARN_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-ink/65 transition hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink/[0.07] pt-6 text-xs text-ink/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PitchPerfect AI. A demo project, built for practice.</p>
          <p>All scores and coaching are sample content. Your speech stays in this browser tab.</p>
        </div>
      </div>
    </footer>
  )
}
