import { api } from 'utils/constants'
import type { AxiosResponse } from 'axios'

export function ttsClone(
  form: FormData
): Promise<AxiosResponse<{ status: string; resultUrl?: string }>> {
  return api.post('/jobs/tts', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
