import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CustomSpin } from '@/shared/ui/Spin';
import { useUserStore } from '@/store/userStore';

const CTFPage = lazy(() => import('../pages/CTFPage'));
const TeamPage = lazy(() => import('../pages/TeamPage'));
const AdminPage = lazy(() => import('../pages/AdminPage'));
const UserPage = lazy(() => import('../pages/UserPage'));

export const AppRouter: React.FC = () => {
  const currentUser = useUserStore((store) => store.currentUser);
  const isAdmin = currentUser?.properties === 'org';

  return (
    <Suspense fallback={<CustomSpin />}>
      <Routes>
        <Route path="/user" element={<UserPage />} />
        <Route path="/ctf" element={<CTFPage />} />
        <Route path="/team" element={<TeamPage />} />
        {isAdmin && <Route path="/admin" element={<AdminPage />} />}
        <Route path="*" element={<Navigate to="/user" replace />} />
      </Routes>
    </Suspense>
  );
};
