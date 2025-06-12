'use client'
import { useState } from 'react'
import UploadField from 'components/UploadField'
import { detectFake } from 'api/detect'
import { useApi } from 'hooks/useApi'

export default function DetectorForm() {
  const [file, setFile] = useState<File|null>(null)
  const { loading, data, error, execute } = useApi<{ score:number }, FormData>(detectFake)

  const submit = () => {
    if (!file) return
    const form = new FormData()
    form.append('audio', file)
    execute(form)
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Deepfake Detector</h1>
      <UploadField label="Upload audio" onFileSelect={setFile} />
      <button
        onClick={submit}
        disabled={loading||!file}
        className="w-full px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50 flex justify-center items-center"
      >
        {loading && <div className="spinner mr-2 w-5 h-5"></div>}
        {loading ? 'Processing…' : 'Analyze'}
      </button>
      {data && <p>Authenticity: {data.score}%</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  )
}
