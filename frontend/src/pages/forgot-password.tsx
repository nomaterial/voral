'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')

  const handle = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: call forgot-password API
    alert(`Reset link sent to ${email}`)
  }

  return (
    <div className="max-w-sm mx-auto mt-16 space-y-6">
      <h1 className="text-3xl font-bold text-center">Forgot Password</h1>
      <form onSubmit={handle} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send Reset Link
        </button>
      </form>
      <p className="text-center text-sm">
        Remembered?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Log In
        </Link>
      </p>
    </div>
  )
}
