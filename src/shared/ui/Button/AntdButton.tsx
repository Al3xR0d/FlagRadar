import { FC, ReactNode } from 'react';
import Button from 'antd/es/button';
import styled from 'styled-components';
import { ButtonType } from 'antd/es/button';

interface Props {
  disabled?: boolean;
  loading?: boolean;
  type?: ButtonType;
  onClick: () => void;
  icon?: ReactNode;
  text?: string;
  key?: string;
}

export const AntdButton: FC<Props> = ({
  disabled,
  loading,
  type = 'primary',
  onClick,
  icon,
  text,
}) => {
  return (
    <StyledButton
      loading={loading}
      type={type}
      onClick={(e) => {
        onClick();
        (e.currentTarget as HTMLElement).blur();
      }}
    >
      {icon}
      {text}
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  && {
    max-width: 180px;
    background: #00ff9d;
    color: #0e0e14;
    border-color: #00ff9d;

    &:hover,
    &:focus,
    &:active {
      background: #00cc7d;
      color: #0e0e14;
      border-color: #00ff9d;
      box-shadow: 0 0 15px rgba(0, 255, 157, 0.6), 0 0 30px rgba(0, 255, 157, 0.4),
        0 0 45px rgba(0, 255, 157, 0.2);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &&.ant-btn:hover,
  &&.ant-btn:focus,
  &&.ant-btn:active {
    background: #00ff9d;
    color: #0e0e14;
    border-color: #00ff9d;
  }
`;
