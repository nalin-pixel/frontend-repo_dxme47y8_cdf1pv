import { useEffect, useState } from 'react'
import { createJob, getPresets, getMotionTemplates } from './api'

export default function Controls({ media, onJobCreated }) {
  const [params, setParams] = useState({
    pose: 'auto',
    expression: 'neutral',
    style: 'original',
    background: 'keep',
    speed: 1.0,
    resolution: '1080p',
    preserve_likeness: true,
    lip_sync: false,
    auto_rigging: true,
    motion_template: null,
  })
  const [presets, setPresets] = useState([])
  const [templates, setTemplates] = useState([])

  useEffect(() => {
    getPresets().then(r => setPresets(r.presets || [])).catch(()=>{})
    getMotionTemplates().then(r => setTemplates(r.templates || [])).catch(()=>{})
  }, [])

  const applyPreset = (p) => {
    setParams(prev => ({ ...prev, ...p.params }))
  }

  const create = async () => {
    const res = await createJob(media.media_id, params)
    onJobCreated(res)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Style</label>
          <select className="w-full border rounded p-2" value={params.style} onChange={e=>setParams(p=>({...p, style:e.target.value}))}>
            {['original','cinematic','cartoon','anime','realistic','sketch'].map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Resolution</label>
          <select className="w-full border rounded p-2" value={params.resolution} onChange={e=>setParams(p=>({...p, resolution:e.target.value}))}>
            {['720p','1080p','2k','4k'].map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Pose</label>
          <input className="w-full border rounded p-2" value={params.pose} onChange={e=>setParams(p=>({...p, pose:e.target.value}))} />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Expression</label>
          <input className="w-full border rounded p-2" value={params.expression} onChange={e=>setParams(p=>({...p, expression:e.target.value}))} />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Background</label>
          <input className="w-full border rounded p-2" value={params.background} onChange={e=>setParams(p=>({...p, background:e.target.value}))} />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Speed</label>
          <input type="number" step="0.05" min="0.25" max="3" className="w-full border rounded p-2" value={params.speed} onChange={e=>setParams(p=>({...p, speed:parseFloat(e.target.value)}))} />
        </div>
        <div className="col-span-2 flex items-center gap-4">
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={params.preserve_likeness} onChange={e=>setParams(p=>({...p, preserve_likeness:e.target.checked}))}/> Preserve likeness</label>
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={params.lip_sync} onChange={e=>setParams(p=>({...p, lip_sync:e.target.checked}))}/> Lip-sync</label>
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={params.auto_rigging} onChange={e=>setParams(p=>({...p, auto_rigging:e.target.checked}))}/> Auto-rigging</label>
        </div>
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Motion template</label>
          <select className="w-full border rounded p-2" value={params.motion_template || ''} onChange={e=>setParams(p=>({...p, motion_template:e.target.value || null}))}>
            <option value="">None</option>
            {templates.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      {presets.length>0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Style presets</h4>
          <div className="flex flex-wrap gap-2">
            {presets.map(p=> (
              <button key={p.name} onClick={()=>applyPreset(p)} className="px-3 py-1 border rounded hover:bg-gray-50 text-sm">
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <button onClick={create} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2">Create animation</button>
    </div>
  )
}
