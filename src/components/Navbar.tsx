import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { buttonClass, cn } from '../lib/ui'

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/workspace', label: 'Workspace' },
  { to: '/#features', label: 'Features' },
  { to: '/#how-it-works', label: 'How it works' },
]

const WORKSPACE_PATHS = ['/workspace', '/analysis', '/revision']

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/' && !location.hash
    if (to === '/workspace') return WORKSPACE_PATHS.includes(location.pathname)
    return location.pathname === '/' && location.hash === to.slice(1)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/[0.06] bg-paper/85 backdrop-blur-md">
      <div className="container-page flex h-[68px] items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              aria-current={isActive(item.to) ? 'page' : undefined}
              className={cn(
                'rounded-full px-3.5 py-2 text-[13.5px] font-medium transition',
                isActive(item.to) ? 'bg-ink/[0.05] text-ink' : 'text-ink/60 hover:bg-ink/[0.03] hover:text-ink',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/workspace" className={cn(buttonClass('dark', 'sm'), 'hidden sm:inline-flex')}>
            Open workspace
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-3.5">
              <path d="M4 10h11M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="grid size-10 place-items-center rounded-full border border-ink/10 bg-white text-ink transition hover:border-ink/25 md:hidden"
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            {open ? (
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-[18px]">
                <path d="m4.5 4.5 11 11M15.5 4.5l-11 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-[18px]">
                <path d="M3.5 6h13M3.5 10h13M3.5 14h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-ink/[0.06] bg-paper md:hidden">
          <nav aria-label="Mobile" className="container-page flex flex-col py-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                aria-current={isActive(item.to) ? 'page' : undefined}
                className={cn(
                  'rounded-xl px-3 py-3 text-sm font-medium transition',
                  isActive(item.to) ? 'bg-ink/[0.05] text-ink' : 'text-ink/70 hover:bg-ink/[0.03] hover:text-ink',
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/workspace" className={cn(buttonClass('primary', 'md'), 'mt-2 w-full')}>
              Open workspace
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
