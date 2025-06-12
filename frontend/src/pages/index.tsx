export default function Home() {
  return (
    <div className="prose dark:prose-invert mx-auto">
      <h1>Welcome to Voral</h1>
      <p>
        Voral is a Deepfake Voice SaaS. Easily swap voices, clone text to speech,
        use native TTS voices, or detect deepfake audio.
      </p>
      <ul className="space-y-2">
        <li>
          <a href="/voice-swap" className="text-blue-600 hover:underline">
            Voice Swap
          </a>
        </li>
        <li>
          <a href="/tts-clone" className="text-blue-600 hover:underline">
            Voice Cloning TTS
          </a>
        </li>
        <li>
          <a href="/tts-stock" className="text-blue-600 hover:underline">
            Native TTS
          </a>
        </li>
        <li>
          <a href="/detect" className="text-blue-600 hover:underline">
            Deepfake Detector
          </a>
        </li>
      </ul>
    </div>
  )
}
