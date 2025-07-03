import styled from 'styled-components';
import Card from 'antd/es/card';

interface Props {
  background?: string;
  border?: string;
}

export const StyledCard = styled(Card)<Props>`
  background: ${({ background }) => background ?? '#1a1a24'};
  border: ${({ border }) => border ?? '1px solid #25253a'};
`;
