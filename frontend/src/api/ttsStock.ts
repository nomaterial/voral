import { api } from 'utils/constants'

export function ttsStock(payload: { text: string; voiceId: string; lang: string }) {
  return api.post('/jobs/tts/stock', payload)
}
