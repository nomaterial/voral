import Link from 'next/link'
import ThemeToggle from 'components/ThemeToggle'

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow">
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Voral
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/about"  className="text-gray-700 dark:text-gray-300 hover:underline">About</Link>
          <Link href="/pricing" className="text-gray-700 dark:text-gray-300 hover:underline">Pricing</Link>
          <Link href="/login"   className="text-gray-700 dark:text-gray-300 hover:underline">Login</Link>
          <Link href="/signup"  className="text-gray-700 dark:text-gray-300 hover:underline">Sign Up</Link>
        </div>
      </nav>
    </header>
  )
}
