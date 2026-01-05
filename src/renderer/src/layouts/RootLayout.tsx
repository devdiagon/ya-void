import { Menu } from 'lucide-react'
import { useState } from 'react'

import { Content, Sidebar } from '@renderer/components'
import { AppRoutes } from '@renderer/routes/AppRoutes'

export const RootLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="lg:hidden bg-white border-b border-gray-200 p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu size={24} />
          </button>
        </header>

        <Content>
          <AppRoutes />
        </Content>
      </div>
    </div>
  )
}
