import { useState } from 'react'
import { uploadMedia } from './api'

export default function UploadPanel({ onUploaded }) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFiles = async (files) => {
    const file = files?.[0]
    if (!file) return
    setError('')
    setLoading(true)
    try {
      const res = await uploadMedia(file)
      onUploaded(res)
    } catch (e) {
      setError(e.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-6 text-center transition ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
    >
      <input
        id="fileInput"
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-gray-700 mb-2">Drop a photo or video here</p>
      <p className="text-gray-500 text-sm mb-4">PNG, JPG, WEBP, MP4, MOV, WEBM</p>
      <label htmlFor="fileInput" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
        {loading ? 'Uploading...' : 'Choose file'}
      </label>
      {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
    </div>
  )
}
