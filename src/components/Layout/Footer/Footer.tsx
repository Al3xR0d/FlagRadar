import { FC, useState } from 'react';
import styled from 'styled-components';
import Flex from 'antd/es/flex';
import Link from 'antd/es/typography/Link';
import { PolicyModal } from '@/components/Modal/PolicyModal';

const StyledFooter = styled.footer`
  margin-top: auto;
  padding: 25px 0;
  text-align: center;
`;

export const Footer: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <StyledFooter>
      <Flex justify="center">
        <Link href="https://www.sberbank.ru/privacy/policy#pdn" target="_blank">
          Политика обработки персональных данных в ПАО Сбербанк
        </Link>
      </Flex>
      <PolicyModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </StyledFooter>
  );
};
