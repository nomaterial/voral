import { api } from 'utils/constants'

export function swapVoice(form: FormData) {
  return api.post('/jobs/swap', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
