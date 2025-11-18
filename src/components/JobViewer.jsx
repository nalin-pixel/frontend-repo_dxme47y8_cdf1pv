import { useEffect, useState } from 'react'
import { getJob, sendChat, getChat, downloadUrl } from './api'

export default function JobViewer({ jobId }) {
  const [job, setJob] = useState(null)
  const [polling, setPolling] = useState(true)
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([])

  useEffect(() => {
    let t
    const poll = async () => {
      try {
        const j = await getJob(jobId)
        setJob(j)
        if (j.status === 'completed' || j.status === 'failed') setPolling(false)
      } catch (e) {
        setPolling(false)
      } finally {
        t = setTimeout(poll, 1000)
      }
    }
    poll()
    return () => clearTimeout(t)
  }, [jobId])

  useEffect(() => {
    const fetchChat = async () => {
      try { const r = await getChat(jobId); setChat(r.messages || []) } catch{}
    }
    fetchChat()
    const i = setInterval(fetchChat, 2000)
    return () => clearInterval(i)
  }, [jobId])

  const send = async () => {
    if (!message.trim()) return
    await sendChat(jobId, message)
    setMessage('')
    const r = await getChat(jobId)
    setChat(r.messages || [])
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white border rounded-xl p-4">
        <h3 className="font-semibold mb-2">Status</h3>
        {!job ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-2">
            <p><span className="font-medium">State:</span> {job.status}</p>
            <div className="w-full h-2 bg-gray-100 rounded overflow-hidden">
              <div className="h-full bg-blue-600" style={{ width: `${job.progress||0}%` }} />
            </div>
            <p className="text-sm text-gray-600">Resolution: {job.params?.resolution} • Style: {job.params?.style} • Speed: {job.params?.speed}</p>
            {job.output?.mp4_url && (
              <video src={downloadUrl(job.output.mp4_url)} controls className="w-full rounded" />
            )}
            {job.output?.gif_url && (
              <div className="mt-2">
                <a href={downloadUrl(job.output.gif_url)} target="_blank" rel="noreferrer" className="text-blue-600 underline">Download GIF</a>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="bg-white border rounded-xl p-4 flex flex-col">
        <h3 className="font-semibold mb-2">AI Chat</h3>
        <div className="flex-1 overflow-auto border rounded p-3 space-y-2 bg-gray-50">
          {chat.length === 0 ? (
            <p className="text-gray-500 text-sm">No messages yet. Ask to change style, resolution, speed, background, pose, expression, enable lip-sync, etc.</p>
          ) : (
            chat.map((m,i)=> (
              <div key={i} className={`p-2 rounded ${m.role==='assistant' ? 'bg-blue-100' : 'bg-white border'}`}>
                <p className="text-xs text-gray-500 mb-1">{m.role}</p>
                <p className="text-sm">{m.content}</p>
              </div>
            ))
          )}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Describe your changes..." className="flex-1 border rounded p-2" />
          <button onClick={send} className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
        </div>
      </div>
    </div>
  )
}
