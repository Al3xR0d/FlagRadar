import React from 'react';
import AntLayout from 'antd/es/layout';
import { Sidebar } from '../Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const { Content } = AntLayout;

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AntLayout style={{ backgroundColor: '#121218' }}>
      <Sidebar />
      <Content style={{ margin: 16 }}>{children}</Content>
    </AntLayout>
  );
};
