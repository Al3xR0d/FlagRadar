import React, { useEffect, useState } from 'react';
import AntLayout from 'antd/es/layout';
import { Sidebar } from '@/components/Layout/Sidebar';
import { AcceptUserModal } from '@/components/Modal/AcceptUserModal';
import { useCurrentUserFull } from '@/hooks/useQueries';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const { Content } = AntLayout;

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: response, isLoading } = useCurrentUserFull();
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading) {
      const msg = response?.msg;
      if (msg === 'User not exists' || msg === undefined) {
        setShowModal(true);
      }
    }
  }, [response, isLoading]);

  return (
    <AntLayout style={{ backgroundColor: '#121218' }}>
      <Sidebar />
      <Content style={{ margin: 16 }}>{children}</Content>
      <AcceptUserModal open={showModal} onClose={() => setShowModal(false)} />
    </AntLayout>
  );
};
