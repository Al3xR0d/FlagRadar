import { FC, ReactNode } from 'react';
import Button from 'antd/es/button';
import Tooltip from 'antd/es/tooltip';
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
  compact?: boolean;
  tooltipText?: string;
  showTooltip?: boolean;
}

interface StyledButtonProps {
  $compact?: boolean;
}

export const AntdButton: FC<Props> = ({
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
      disabled={disabled}
      // onClick={(e) => {
      //   if (onClick) onClick();
      //   (e.currentTarget as HTMLElement).blur();
      // }}
      onClick={onClick}
      $compact={compact}
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
    /* max-width: 180px; */
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
