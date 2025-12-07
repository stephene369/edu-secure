// layouts/AppLayout.jsx
import { useState } from 'react'
import Topbar from '../components/layout/Topbar'
import Sidebar from '../components/layout/Sidebar'

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <Topbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex w-full">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content */}
        <main className="flex-1 lg:m-2 w-full min-h-screen">
          <div className="p-4 w-full max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}