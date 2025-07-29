import { FC } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import styled from 'styled-components';

export const AntdClose: FC = ({}) => {
  return <StyledClose />;
};

const StyledClose = styled(CloseOutlined)`
  color: #eef3ff;
  font-size: 12px;
  transition: all 0.3s ease;

  &:hover {
    color: #eef3ff;
    font-size: 18px;
    transform: scale(1.1);
    color: tomato;
  }
`;
