import { useEffect, useState } from 'react'
import { cn, scoreTone } from '../lib/ui'

interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  className?: string
}

export default function ScoreRing({ score, size = 84, strokeWidth = 7, className }: ScoreRingProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setProgress(score))
    return () => cancelAnimationFrame(frame)
  }, [score])

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.max(0, Math.min(100, progress)) / 100)
  const tone = scoreTone(score)

  return (
    <div
      className={cn('relative shrink-0', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${score} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          className="text-ink/[0.07]"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.22, 0.68, 0, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-serif leading-none', tone.text)} style={{ fontSize: size * 0.3 }}>
          {score}
        </span>
        <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.18em] text-ink/40">/ 100</span>
      </div>
    </div>
  )
}
