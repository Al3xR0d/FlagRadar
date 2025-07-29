import styled from 'styled-components';

interface Props {
  marginLeft?: string;
  color?: string;
}

export const FormLabel = styled.span<Props>`
  color: ${({ color }) => color ?? '#EEF3FF'};
  margin-left: ${({ marginLeft }) => marginLeft ?? 0}px;
`;
