import { FC } from 'react';
import loading from '@/images/loading.gif';
import styled from 'styled-components';
import Spin from 'antd/es/spin';

const SpinContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SpinImage = styled.img`
  width: 100px;
`;

export const CustomSpin: FC = () => {
  return (
    <SpinContainer>
      {/* <SpinImage src={loading} alt="Загрузка..." /> */}
      <Spin size="large" />
    </SpinContainer>
  );
};
