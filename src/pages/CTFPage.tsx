import React, { useRef, useCallback } from 'react';
import { CTFTable } from '../components/Table/CTFTable/CTFTable';
import { useCtfQuery } from '@/hooks/useQueries';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import Flex from 'antd/es/flex';

const CTFPage: React.FC = () => {
  const { data, isLoading } = useCtfQuery();

  const ctfRef = useRef<HTMLDivElement>(null);

  const scrollToRef = (ref: typeof ctfRef) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onCtfTableChange = useCallback(() => {
    scrollToRef(ctfRef);
  }, []);

  return (
    <>
      <Flex vertical style={{ minHeight: '100vh' }}>
        <Header title="CTF" />
        <div ref={ctfRef}>
          <CTFTable isLoading={isLoading} data={data?.data ?? []} onChange={onCtfTableChange} />
        </div>
        <Footer />
      </Flex>
    </>
  );
};

export default CTFPage;
