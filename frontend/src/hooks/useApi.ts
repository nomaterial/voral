import { useState } from 'react'
import type { AxiosResponse } from 'axios'

export function useApi<T, U>(
  fn: (payload: U) => Promise<AxiosResponse<T>>
) {
  const [loading, setLoading] = useState(false)
  const [data, setData]     = useState<T | null>(null)
  const [error, setError]   = useState<string | null>(null)

  async function execute(payload: U) {
    setLoading(true)
    setError(null)
    try {
      const res = await fn(payload)
      setData(res.data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return { loading, data, error, execute }
}
