import styled from 'styled-components';

interface Props {
  className: string;
  color?: string;
  marginRight?: string;
  fontSize?: string;
  marginBottom?: string;
}

export const Icon = styled.i<Props>`
  margin-right: ${({ marginRight }) => marginRight ?? 0}px;
  color: ${({ color }) => color ?? '#00FF9D'};
  font-size: ${({ fontSize }) => fontSize ?? 24}px;
  margin-bottom: ${({ marginBottom }) => marginBottom ?? 0}px;
`;
