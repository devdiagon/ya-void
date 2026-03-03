import { Content, Sidebar } from '@renderer/components';
import { AppRoutes } from '@renderer/routes/AppRoutes';

export const RootLayout = (): React.JSX.Element => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Content>
          <AppRoutes />
        </Content>
      </div>
    </div>
  );
};
