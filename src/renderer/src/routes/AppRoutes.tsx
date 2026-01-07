import { AreasAdminPage, FarmAdminPage, RequestersAdminPage } from '@renderer/pages/administrate';
import { Reports } from '@renderer/pages/examples';
import { Register } from '@renderer/pages/Register';
import { Navigate, Route, Routes } from 'react-router-dom';

export const AppRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Reports />} />
      <Route path="/administrate/farms" element={<FarmAdminPage />} />
      <Route path="/administrate/farms/:farmId/areas" element={<AreasAdminPage />} />
      <Route
        path="/administrate/farms/:farmId/areas/:areaId/requesters"
        element={<RequestersAdminPage />}
      />
      <Route path="/work-zones/*" element={<Register />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
