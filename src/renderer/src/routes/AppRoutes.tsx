import { Reports } from "@renderer/pages/examples";
import { Register } from "@renderer/pages/Register";
import { Navigate, Route, Routes } from "react-router-dom";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Reports />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/register/*" element={<Register />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}