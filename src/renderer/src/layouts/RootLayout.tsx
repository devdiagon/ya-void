import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Menu } from "lucide-react";

import { Content, Sidebar } from "@renderer/components";
import { Register, Reports } from "@renderer/pages/examples";

export const RootLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return(
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header con botón de menú para mobile */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu size={24} />
          </button>
        </header>

        <Content>
          <Routes>
            <Route path="/" element={<Reports />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Content>
      </div>
    </div>
  );
}