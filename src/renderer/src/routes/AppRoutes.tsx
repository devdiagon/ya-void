import { AreasAdminPage, FarmAdminPage } from '@renderer/pages/administrate';
import { Reports } from '@renderer/pages/examples';
import { FarmWorkZonesPage, WorkZonesPage } from '@renderer/pages/work-zones';
import { Navigate, Route, Routes } from 'react-router-dom';

export const AppRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Reports />} />
      <Route path="/administrate/farms" element={<FarmAdminPage />} />
      <Route path="/administrate/farms/:farmId/areas" element={<AreasAdminPage />} />
      <Route path="/work-zones" element={<WorkZonesPage />} />
      <Route path="/work-zones/:workZoneId/farms" element={<FarmWorkZonesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
