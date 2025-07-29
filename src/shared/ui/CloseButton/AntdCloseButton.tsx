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
  text: string;
  key?: string;
}

export const AntdCloseButton: FC<Props> = ({
  disabled,
  loading,
  type = 'primary',
  onClick,
  icon,
  text,
}) => {
  return (
    <StyledButton loading={loading} type={type} onClick={onClick}>
      {icon}
      {text}
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  && {
    max-width: 180px;
    background: #151522;
    color: #eef3ff;
    border: 1px solid #25253a;

    &:hover,
    &:focus,
    &:active {
      background: #151522;
      color: #eef3ff;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &&.ant-btn:hover,
  &&.ant-btn:focus,
  &&.ant-btn:active {
    background: #151522;
    color: #eef3ff;
    border-color: #00ff9d;
  }
`;
