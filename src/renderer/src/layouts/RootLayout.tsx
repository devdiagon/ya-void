import { Content, Sidebar } from '@renderer/components';
import { AppRoutes } from '@renderer/routes/AppRoutes';
import { useState } from 'react';

export const RootLayout = (): React.JSX.Element => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Content>
          <AppRoutes />
        </Content>
      </div>
    </div>
  );
};
