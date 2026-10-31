import { Link } from 'react-router-dom'
import { cn } from '../lib/ui'

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="PitchPerfect AI home"
      className={cn('inline-flex items-center gap-2.5 rounded-full', className)}
    >
      <span className="grid size-9 place-items-center rounded-xl bg-accent text-white shadow-[0_8px_20px_-10px_rgba(91,61,245,0.9)]">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
          <path
            d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="flex items-baseline gap-1.5">
        <span className="font-serif text-[19px] font-medium tracking-tight text-ink">PitchPerfect</span>
        <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
          AI
        </span>
      </span>
    </Link>
  )
}
