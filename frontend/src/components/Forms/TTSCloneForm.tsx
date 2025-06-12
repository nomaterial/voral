// src/components/Forms/TTSCloneForm.tsx
'use client'

import { useState } from 'react'
import UploadField from 'components/UploadField'
import { ttsClone } from 'api/ttsClone'
import { useApi } from 'hooks/useApi'
import JobStatus from 'components/JobStatus'
import ResultPlayer from 'components/ResultPlayer'
import { LANGUAGES } from 'utils/constants'

export default function TTSCloneForm() {
  const [text, setText]       = useState('')
  const [refFile, setRefFile] = useState<File | null>(null)
  const [lang, setLang]       = useState(LANGUAGES[0].value)
  const { loading, data, error, execute } = useApi<
    { status: string; resultUrl?: string },
    FormData
  >(ttsClone)

  const submit = () => {
    if (!text || !refFile) return
    const form = new FormData()
    form.append('text', text)
    form.append('ref', refFile)
    form.append('lang', lang)
    execute(form)
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Voice Cloning TTS</h1>

      {/* Language selector */}
      <label className="block">
        <span className="text-gray-700">Language</span>
        <select
          className="mt-1 block w-full border rounded p-2"
          value={lang}
          onChange={e => setLang(e.target.value)}
        >
          {LANGUAGES.map(l => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </label>

      <UploadField label="Reference Voice File" onFileSelect={setRefFile} />

      <label className="block">
        <span className="text-gray-700">Text to Synthesize</span>
        <textarea
          rows={3}
          className="mt-1 block w-full border rounded p-2"
          placeholder="Enter text…"
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>

      <button
        onClick={submit}
        disabled={loading || !text || !refFile}
        className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
      >
        {loading && <div className="spinner w-5 h-5"></div>}
        {loading ? 'Processing…' : 'Start Cloning'}
      </button>

      {data && <JobStatus status={data.status} />}
      {error && <p className="text-red-600">{error}</p>}
      {data?.resultUrl && (
        <ResultPlayer url={`${process.env.NEXT_PUBLIC_API_URL}/${data.resultUrl}`} />
      )}
    </div>
  )
}
