import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AUDIENCES, GOALS, type AnalysisResult, type Audience, type Goal, type SpeechDraft } from '../types'
import { analyseSpeech } from '../lib/analysis'
import { buildRevision } from '../lib/revision'

const STORAGE_KEY = 'pitchperfect:session:v1'

const EMPTY_DRAFT: SpeechDraft = {
  title: '',
  text: '',
  audience: 'General',
  goal: 'Persuade',
}

interface Session {
  draft: SpeechDraft
  result: AnalysisResult | null
}

interface SpeechContextValue {
  draft: SpeechDraft
  result: AnalysisResult | null
  updateDraft: (patch: Partial<SpeechDraft>) => void
  analyse: () => AnalysisResult
  clearResult: () => void
}

const SpeechContext = createContext<SpeechContextValue | null>(null)

function loadSession(): Session {
  const fallback: Session = { draft: { ...EMPTY_DRAFT }, result: null }
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<Session> | null
    if (!parsed || typeof parsed !== 'object' || !parsed.draft) return fallback
    const { draft } = parsed
    if (
      typeof draft.title !== 'string' ||
      typeof draft.text !== 'string' ||
      !AUDIENCES.includes(draft.audience as Audience) ||
      !GOALS.includes(draft.goal as Goal)
    ) {
      return fallback
    }
    const result =
      parsed.result && parsed.result.analysis && Array.isArray(parsed.result.analysis.scores) && parsed.result.revision
        ? parsed.result
        : null
    return { draft: { ...EMPTY_DRAFT, ...draft }, result }
  } catch {
    return fallback
  }
}

export function SpeechProvider({ children }: { children: ReactNode }) {
  const [initialSession] = useState<Session>(loadSession)
  const [draft, setDraft] = useState<SpeechDraft>(initialSession.draft)
  const [result, setResult] = useState<AnalysisResult | null>(initialSession.result)

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ draft, result }))
    } catch {
      // Session storage can be unavailable (private mode, quota). The app still works from memory.
    }
  }, [draft, result])

  const updateDraft = useCallback((patch: Partial<SpeechDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
  }, [])

  const analyse = useCallback((): AnalysisResult => {
    const analysis = analyseSpeech(draft)
    const revision = buildRevision(draft)
    const next: AnalysisResult = { analysis, revision, input: { ...draft } }
    setResult(next)
    return next
  }, [draft])

  const clearResult = useCallback(() => setResult(null), [])

  const value = useMemo(
    () => ({ draft, result, updateDraft, analyse, clearResult }),
    [draft, result, updateDraft, analyse, clearResult],
  )

  return <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>
}

export function useSpeech(): SpeechContextValue {
  const context = useContext(SpeechContext)
  if (!context) throw new Error('useSpeech must be used inside SpeechProvider')
  return context
}
