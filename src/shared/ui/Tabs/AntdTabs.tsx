import styled from 'styled-components';
import { FC } from 'react';
import { Tabs } from 'antd/es';

const { TabPane } = Tabs;

interface AntdTabsProps {
  children?: React.ReactNode;
  [key: string]: any;
}

export const AntdTabs: FC<AntdTabsProps> & { TabPane: typeof TabPane } = (props) => {
  return <StyledTabs {...props} />;
};

AntdTabs.TabPane = TabPane;

const StyledTabs = styled(Tabs)`
  && .ant-tabs-tab {
    color: #8a8aa8;
  }

  && .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #00ff9d;
  }

  && .ant-tabs-ink-bar {
    background: #00ff9d;
  }

  && .ant-tabs-tab:hover {
    color: #00ff9d;
  }

  && .ant-tabs-nav::before {
    border-bottom: 1px solid rgba(0, 0, 0, 0.88);
  }
`;
