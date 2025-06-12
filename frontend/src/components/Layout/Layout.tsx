// src/components/Layout/Layout.tsx
import Header from 'components/Header'
import Sidebar from './Sidebar'   
import Footer from 'components/Footer'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
