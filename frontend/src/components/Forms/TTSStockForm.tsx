// src/components/Forms/TTSStockForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { ttsStock } from 'api/ttsStock'
import { useApi } from 'hooks/useApi'
import JobStatus from 'components/JobStatus'
import ResultPlayer from 'components/ResultPlayer'
import { LANGUAGES } from 'utils/constants'

interface VoicePreset {
  id: string
  name: string
}

export default function TTSStockForm() {
  const [text, setText]                   = useState('')
  const [lang, setLang]                   = useState(LANGUAGES[0].value)
  const [voices, setVoices]               = useState<VoicePreset[]>([])
  const [selectedVoice, setSelectedVoice] = useState('')
  const { loading, data, error, execute } = useApi<
    { status: string; resultUrl?: string },
    { text: string; voiceId: string; lang: string }
  >(ttsStock)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/voices/presets`)
      .then(res => res.json())
      .then(setVoices)
      .catch(console.error)
  }, [])

  const submit = () => {
    if (!text || !selectedVoice) return
    execute({ text, voiceId: selectedVoice, lang })
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Native TTS</h1>

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

      {/* Voice preset selector */}
      <label className="block">
        <span className="text-gray-700">Voice Preset</span>
        <select
          className="mt-1 block w-full border rounded p-2"
          value={selectedVoice}
          onChange={e => setSelectedVoice(e.target.value)}
        >
          <option value="">Choose a voice…</option>
          {voices.map(v => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </label>

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
        disabled={loading || !text || !selectedVoice}
        className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded disabled:opacity-50"
      >
        {loading && <div className="spinner w-5 h-5"></div>}
        {loading ? 'Processing…' : 'Start TTS'}
      </button>

      {data && <JobStatus status={data.status} />}
      {error && <p className="text-red-600">{error}</p>}
      {data?.resultUrl && (
        <ResultPlayer url={`${process.env.NEXT_PUBLIC_API_URL}/${data.resultUrl}`} />
      )}
    </div>
  )
}
