import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto space-y-4 mt-16">
      <h1 className="text-2xl font-bold text-center">Login</h1>
      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded p-2"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded"
        >
          Sign In
        </button>
      </form>
      <p className="text-sm text-center">
        <Link href="/forgot-password" className="text-blue-600 hover:underline">
          Forgot Password?
        </Link>
      </p>
    </div>
  )
}
