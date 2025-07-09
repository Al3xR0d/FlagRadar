import styled from 'styled-components';
import Flex from 'antd/es/flex';

interface Props {
  minHeight?: string;
  vertical?: boolean;
}

export const PageContainer = styled(Flex)<Props>`
  min-height: ${({ minHeight }) => minHeight ?? '100vh'};
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  box-sizing: border-box;
`;
