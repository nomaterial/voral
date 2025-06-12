// src/components/Layout/Sidebar.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/router'

const items = [
  { href: '/',           label: 'Home' },
  { href: '/voice-swap', label: 'Voice Swap' },
  { href: '/tts-clone',  label: 'Voice Cloning TTS' },
  { href: '/tts-stock',  label: 'Native TTS' },
  { href: '/detect',     label: 'Deepfake Detector' },
]

export default function Sidebar() {
  const { pathname, push } = useRouter()

  return (
    <aside className="bg-gray-100 dark:bg-gray-900 border-r">
      {/* Mobile dropdown */}
      <div className="p-4 md:hidden">
        <select
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-gray-100"
          value={pathname}
          onChange={e => push(e.target.value)}
        >
          {items.map(i => (
            <option key={i.href} value={i.href}>
              {i.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop links */}
      <nav className="hidden md:block p-4 space-y-2">
        {items.map(i => {
          const active = pathname === i.href
          return (
            <Link
              key={i.href}
              href={i.href}
              className={`block px-3 py-2 rounded ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              {i.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
