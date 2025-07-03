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

export const AntdCancelButton: FC<Props> = ({
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
    min-width: 132px;
    max-width: 180px;
    background: #ff4d4f;
    color: #ffffff;
    border-color: #ff4d4f;

    &:hover,
    &:focus,
    &:active {
      background: #d9363e;
      color: #ffffff;
      border-color: #ff4d4f;
      box-shadow: 0 0 15px rgba(255, 77, 79, 0.6), 0 0 30px rgba(255, 77, 79, 0.4),
        0 0 45px rgba(255, 77, 79, 0.2);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &&.ant-btn:hover,
  &&.ant-btn:focus,
  &&.ant-btn:active {
    background: #ff4d4f;
    color: #ffffff;
    border-color: #ff4d4f;
  }
`;
