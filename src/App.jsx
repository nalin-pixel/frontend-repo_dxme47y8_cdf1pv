import { useState } from 'react'
import UploadPanel from './components/UploadPanel'
import Controls from './components/Controls'
import JobViewer from './components/JobViewer'

function App() {
  const [uploaded, setUploaded] = useState(null)
  const [jobId, setJobId] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold">AI Animator Studio</h1>
          <p className="text-slate-300">Import photos and videos, generate high‑quality animations, chat to refine, and export up to 4K.</p>
        </header>

        {!uploaded ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <UploadPanel onUploaded={setUploaded} />
            <p className="mt-4 text-center text-sm text-slate-300">Completely free demo • Your likeness is preserved • No sign‑in required</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-4">
              <h2 className="font-semibold mb-4">Advanced controls</h2>
              <Controls media={uploaded} onJobCreated={(res)=> setJobId(res.job_id)} />
            </div>
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-4">
              {jobId ? (
                <JobViewer jobId={jobId} />
              ) : (
                <div className="text-slate-300 text-sm">Create an animation to view status, results, and use the AI chatbox.</div>
              )}
            </div>
          </div>
        )}

        <footer className="pt-4 text-center text-slate-400 text-xs">
          Optional features: style presets, auto‑rigging, lip‑sync, motion templates supported.
        </footer>
      </div>
    </div>
  )
}

export default App
