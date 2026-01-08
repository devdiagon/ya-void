import { ReactNode } from 'react';

export const Content = ({ children }: { children: ReactNode }) => {
  return <main className="flex-1 overflow-auto bg-gray-50 h-screen p-6">{children}</main>;
};
