import React from 'react';
import { CTFTable } from '../components/Table/CTFTable/CTFTable';
import { useCtfQuery } from '@/hooks/useQueries';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import Flex from 'antd/es/flex';

const CTFPage: React.FC = () => {
  const { data, isLoading } = useCtfQuery();

  return (
    <>
      <Flex vertical style={{ minHeight: '100vh' }}>
        <Header title="CTF" />
        <CTFTable isLoading={isLoading} data={data?.data ?? []} />
        <Footer />
      </Flex>
    </>
  );
};

export default CTFPage;
