import { AreasAdminPage, FarmAdminPage } from '@renderer/pages/administrate';
import { SearchTripPage } from '@renderer/pages/search';
import {
    FarmWorkZonesPage,
    WorkZonePanelPage,
    WorkZoneSheetsPage,
    WorkZonesPage
} from '@renderer/pages/work-zones';
import { Navigate, Route, Routes } from 'react-router-dom';

export const AppRoutes = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/work-zones" replace />} />
      <Route path="/administrate/farms" element={<FarmAdminPage />} />
      <Route path="/administrate/farms/:farmId/areas" element={<AreasAdminPage />} />
      <Route path="/panel" element={<WorkZonePanelPage />} />
      <Route path="/work-zones" element={<WorkZonesPage />} />
      <Route path="/work-zones/:workZoneId/farms" element={<FarmWorkZonesPage />} />
      <Route
        path="/work-zones/:workZoneId/farms/:farmWorkZoneId"
        element={<WorkZoneSheetsPage />}
      />
      <Route path="/search-trip" element={<SearchTripPage />} />
      <Route path="*" element={<Navigate to="/work-zones" replace />} />
    </Routes>
  );
};
