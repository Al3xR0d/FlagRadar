import styled from 'styled-components';

interface Props {
  marginLeft?: string;
  color?: string;
}

export const FormLabel = styled.span<Props>`
  color: ${({ color }) => color ?? '#e0e0ff'};
  margin-left: ${({ marginLeft }) => marginLeft ?? 0}px;
`;
