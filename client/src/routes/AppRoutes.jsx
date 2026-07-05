import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx';
import ProtectedRoute from './ProtectedRoutes.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';
import CommandPage from '../pages/CommandPage.jsx'
import ServersPage from '../pages/ServerPage.jsx';
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/commands" element={<CommandPage />} />
          {/* <Route path="/rules" element={<RulesPage />} /> */}
          <Route path="/servers" element={<ServersPage />} />
          {/* <Route path="/settings" element={<SettingsPage />} /> */}
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
    </Routes>
  );
}
