import { FC, ReactNode } from 'react';
import Button from 'antd/es/button';
import styled from 'styled-components';
import { ButtonType } from 'antd/es/button';
import Tooltip from 'antd/es/tooltip';

interface Props {
  disabled?: boolean;
  loading?: boolean;
  type?: ButtonType;
  onClick: () => void;
  icon?: ReactNode;
  text?: string;
  key?: string;
  compact?: boolean;
  tooltipText?: string;
  showTooltip?: boolean;
}

interface StyledButtonProps {
  $compact?: boolean;
}

export const AntdCancelButton: FC<Props> = ({
  disabled = false,
  loading,
  type = 'primary',
  onClick,
  icon,
  text,
  compact = true,
  tooltipText,
  showTooltip = false,
}) => {
  const button = (
    <StyledButton
      loading={loading}
      type={type}
      // onClick={(e) => {
      //   onClick();
      //   (e.currentTarget as HTMLElement).blur();
      // }}
      onClick={onClick}
      $compact={compact}
      disabled={disabled}
    >
      {icon}
      {text}
    </StyledButton>
  );
  return showTooltip ? (
    <Tooltip title={tooltipText} placement="top">
      {button}
    </Tooltip>
  ) : (
    button
  );
};

const StyledButton = styled(Button)<StyledButtonProps>`
  position: relative;
  display: inline-block;

  && {
    min-width: ${({ $compact }) => ($compact ? 'unset' : '132px')};
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
