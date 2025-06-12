export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-6">
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} Voral. All rights reserved.
      </div>
    </footer>
  )
}
