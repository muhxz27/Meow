import { Link } from 'react-router-dom'
import { buttonClass } from '../lib/ui'

export default function NotFound() {
  return (
    <div className="container-page animate-rise py-24 text-center sm:py-32">
      <p className="eyebrow">404</p>
      <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-medium leading-[1.08] tracking-[-0.015em] text-ink sm:text-6xl">
        This page left the stage.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-7 text-ink/60">
        The link may be out of date, or the page never existed. Your draft is still waiting in the
        workspace.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link to="/workspace" className={buttonClass('primary', 'md')}>
          Open the workspace
        </Link>
        <Link to="/" className={buttonClass('secondary', 'md')}>
          Back to the landing page
        </Link>
      </div>
    </div>
  )
}
