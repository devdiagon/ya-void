import { Reports } from '@renderer/pages/examples';
import { Register } from '@renderer/pages/Register';
import { Navigate, Route, Routes } from 'react-router-dom';

export const AppRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Reports />} />
      <Route path="/administrate" element={<Reports />} />
      <Route path="/work-zones/*" element={<Register />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
