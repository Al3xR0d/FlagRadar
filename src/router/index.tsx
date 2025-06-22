import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CustomSpin } from '@/shared/ui/Spin';
import Spin from 'antd/es/spin';

const CTFPage = lazy(() => import('../pages/CTFPage'));
const TeamPage = lazy(() => import('../pages/TeamPage'));
const AdminPage = lazy(() => import('../pages/AdminPage'));
const UserPage = lazy(() => import('../pages/UserPage'));

export const AppRouter: React.FC = () => (
  <Suspense fallback={<Spin tip="Загрузка..." />}>
    {/* <Suspense fallback={<CustomSpin />}> */}
    <Routes>
      <Route path="/user" element={<UserPage />} />
      <Route path="/ctf" element={<CTFPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/user" replace />} />
    </Routes>
  </Suspense>
);
