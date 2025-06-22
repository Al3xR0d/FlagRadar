import { FC, ReactNode } from 'react';
import Typography from 'antd/es/typography';
import styled from 'styled-components';

const { Link } = Typography;

interface Props {
  href?: string;
  target?: string;
  rel?: string;
  children?: ReactNode;
  onClick?: () => void;
}

export const AntdLink: FC<Props> = ({
  href,
  target,
  rel = 'noopener noreferrer',
  children,
  onClick,
}) => {
  return (
    <>
      <StyledLink
        href={href}
        target={target}
        rel={target === '_blank' ? rel : undefined}
        onClick={onClick}
      >
        {children}
      </StyledLink>
    </>
  );
};

const StyledLink = styled(Link)`
  &.ant-typography {
    color: #00ff9d;
    text-decoration: underline;
    text-decoration-color: rgba(0, 255, 157, 1);
    transition: all 0.2s ease;

    &:hover {
      color: #00cc7d;
      text-decoration-color: rgba(0, 204, 125, 0.6);
    }

    &:active {
      color: #00aa6d;
      text-decoration-color: rgba(0, 204, 125, 0.6);
    }

    &:visited {
      color: #00ff9d;
      text-decoration-color: rgba(0, 204, 125, 0.6);
    }

    &:focus {
      color: #00ff9d;
      text-decoration-color: rgba(0, 255, 157, 0.5);
      outline: none;
    }
  }
`;
