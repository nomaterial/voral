import { api } from 'utils/constants'

export function detectFake(form: FormData) {
  return api.post('/detect', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
