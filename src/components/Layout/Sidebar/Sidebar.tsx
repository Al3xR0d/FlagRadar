import { useState } from 'react';
import Menu from 'antd/es/menu';
import AntLayout from 'antd/es/layout';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const { Sider } = AntLayout;
const items = [
  { key: '/user', label: 'Профиль', icon: <i className="fas fa-user" aria-hidden="true" /> },
  { key: '/ctf', label: 'CTF', icon: <i className="fas fa-flag" aria-hidden="true" /> },
  { key: '/team', label: 'Моя команда', icon: <i className="fas fa-users" aria-hidden="true" /> },
  { key: '/admin', label: 'Админошная', icon: <i className="fas fa-cog" aria-hidden="true" /> },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Sider
      width={220}
      style={{
        minHeight: '100vh',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        backgroundColor: '#0e0e14',
        borderRight: '1px solid #25253a',
      }}
      className="custom-sider"
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div
        className="logo"
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 24px',
          margin: '6px 0',
          // color: '#fff',
          fontSize: 20,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        <i
          className="fas fa-shield-alt"
          aria-hidden="true"
          style={{
            flexShrink: 0,
            height: 25,
            transition: 'margin 0.2s ease',
            color: '#00FF9D',
          }}
        />
        {!collapsed && (
          <span
            style={{
              marginLeft: 8,
              height: 25,
              opacity: collapsed ? 0 : 1,
              transition: 'opacity 0.2s ease 0.1s',
              background: 'linear-gradient(90deg, #00FF9D 0%, #00FFEA 50%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            FlagRadar
          </span>
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        style={{
          backgroundColor: '#0e0e14',
        }}
        onClick={({ key }) => navigate(key)}
        items={items}
      />
    </Sider>
  );
};
