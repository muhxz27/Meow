import { useEffect, useRef, useState } from 'react'
import { buttonClass, cn } from '../lib/ui'

async function writeToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fall through to the legacy path.
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.top = '0'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const copied = document.execCommand('copy')
    document.body.removeChild(textarea)
    return copied
  } catch {
    return false
  }
}

interface CopyButtonProps {
  text: string
  label?: string
  copiedLabel?: string
  className?: string
}

export default function CopyButton({
  text,
  label = 'Copy revised speech',
  copiedLabel = 'Copied to clipboard',
  className,
}: CopyButtonProps) {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    return () => window.clearTimeout(timer.current)
  }, [])

  const handleCopy = async () => {
    window.clearTimeout(timer.current)
    const copied = await writeToClipboard(text)
    setState(copied ? 'copied' : 'error')
    timer.current = window.setTimeout(() => setState('idle'), 2400)
  }

  return (
    <div className={cn('flex flex-col items-start gap-1.5', className)}>
      <button type="button" onClick={handleCopy} className={buttonClass('primary', 'md')}>
        {state === 'copied' ? (
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
            <path d="m4.5 10.5 3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
            <rect x="7" y="7" width="9.5" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M13 5.5V4.8A1.8 1.8 0 0 0 11.2 3H4.8A1.8 1.8 0 0 0 3 4.8v6.4A1.8 1.8 0 0 0 4.8 13h.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        )}
        {state === 'copied' ? copiedLabel : state === 'error' ? 'Copy failed' : label}
      </button>
      <span role="status" aria-live="polite" className="min-h-[16px] text-xs text-ink/50">
        {state === 'error' ? 'Select the revision text and copy it manually.' : ''}
      </span>
    </div>
  )
}
