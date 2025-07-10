import { useState } from 'react';
import styled from 'styled-components';
import Menu from 'antd/es/menu';
import AntLayout from 'antd/es/layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

const { Sider } = AntLayout;

const StyledSider = styled(Sider)`
  min-height: 100vh;
  overflow: hidden;
  transition: all 0.2s ease;
  background-color: #0e0e14;
  border-right: 1px solid #25253a;

  & .ant-layout-sider-trigger {
    background: #121218;
    border-top: 1px solid #25253a;
    border-right: 1px solid #25253a;
  }
`;

const LogoWrapper = styled.div<{ collapsed: boolean }>`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: ${({ collapsed }) => (collapsed ? 'center' : 'flex-start')};
  padding: ${({ collapsed }) => (collapsed ? '0' : '0 24px')};
  margin: 6px 0;
  font-size: 24px;
  white-space: nowrap;
  overflow: hidden;
`;

const ShieldIcon = styled.i`
  flex-shrink: 0;
  height: 25px;
  font-size: 24px;
  transition: margin 0.2s ease;
  color: #00ff9d;
`;

const LogoText = styled.span<{ collapsed: boolean }>`
  margin-left: 8px;
  opacity: ${({ collapsed }) => (collapsed ? 0 : 1)};
  transition: opacity 0.2s ease 0.1s;
  background: linear-gradient(90deg, #00ff9d 0%, #00ffea 50%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const StyledMenu = styled(Menu)`
  background-color: #0e0e14;
  font-size: 15px;

  & .ant-menu-item {
    color: #8a8aa8;
  }

  & .ant-menu-item:hover,
  & .ant-menu-item-active {
    background-color: rgba(0, 255, 157, 0.08) !important;
    color: #e0e0ff !important;
  }

  & .ant-menu-item-selected {
    background-color: rgba(0, 255, 157, 0.08);
    color: #e0e0ff;
  }
`;

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const currentUser = useUserStore((store) => store.currentUser);
  const isAdmin = currentUser?.properties === 'org';

  const items = [
    { key: '/user', label: 'Профиль', icon: <i className="fas fa-user" aria-hidden="true" /> },
    { key: '/ctf', label: 'CTF', icon: <i className="fas fa-flag" aria-hidden="true" /> },
    { key: '/ai', label: 'AI Помощник', icon: <i className="fas fa-brain" /> },
    { key: '/rating', label: 'Рейтинг', icon: <i className="fas fa-line-chart" /> },
    ...(!isAdmin
      ? [
          {
            key: '/team',
            label: 'Моя команда',
            icon: <i className="fas fa-users" aria-hidden="true" />,
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            key: '/admin',
            label: 'Админошная',
            icon: <i className="fas fa-cog" aria-hidden="true" />,
          },
        ]
      : []),
  ];

  return (
    <StyledSider
      width={260}
      className="custom-sider"
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <LogoWrapper collapsed={collapsed}>
        <ShieldIcon className="fas fa-shield-alt" aria-hidden="true" />
        {!collapsed && <LogoText collapsed={collapsed}>FlagRadar</LogoText>}
      </LogoWrapper>
      <StyledMenu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        onClick={({ key }) => navigate(key)}
        items={items}
      />
    </StyledSider>
  );
};
