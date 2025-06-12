// src/components/ThemeToggle.tsx
'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // after mount we have the correct theme
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // avoid any SVG or text until after mount
    return <button className="p-2 rounded opacity-0" aria-hidden />
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  )
}
