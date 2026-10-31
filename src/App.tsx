import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { SpeechProvider } from './context/SpeechContext'
import AnalysisPage from './pages/Analysis'
import Landing from './pages/Landing'
import NotFound from './pages/NotFound'
import RevisionPage from './pages/Revision'
import Workspace from './pages/Workspace'

export default function App() {
  return (
    <SpeechProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="workspace" element={<Workspace />} />
            <Route path="analysis" element={<AnalysisPage />} />
            <Route path="revision" element={<RevisionPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SpeechProvider>
  )
}
