export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}

export type ButtonVariant = 'primary' | 'dark' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  dark: 'btn-dark',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
}

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
}

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md'): string {
  return cn('btn', VARIANT_CLASS[variant], SIZE_CLASS[size])
}

export interface ScoreTone {
  stroke: string
  text: string
  surface: string
  label: string
}

export function scoreTone(score: number): ScoreTone {
  if (score >= 85) {
    return { stroke: '#12866B', text: 'text-moss', surface: 'bg-moss/10', label: 'Strong' }
  }
  if (score >= 70) {
    return { stroke: '#5B3DF5', text: 'text-accent', surface: 'bg-accent/10', label: 'Solid' }
  }
  if (score >= 55) {
    return { stroke: '#B7791F', text: 'text-amber', surface: 'bg-amber/10', label: 'Fair' }
  }
  return { stroke: '#B4433C', text: 'text-rose', surface: 'bg-rose/10', label: 'Needs work' }
}
