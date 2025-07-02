import { FC, useState } from 'react';
import Flex from 'antd/es/flex';
import Link from 'antd/es/typography/Link';
import { PolicyModal } from '@/components/Modal/PolicyModal';

export const Footer: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer
      style={{
        marginTop: 'auto',
        padding: '25px 0',
        textAlign: 'center',
      }}
    >
      <Flex justify="center">
        <Link href="https://www.sberbank.ru/privacy/policy#pdn" target="_blank">
          Политика обработки персональных данных в ПАО Сбербанк
        </Link>
      </Flex>
      <PolicyModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </footer>
  );
};
