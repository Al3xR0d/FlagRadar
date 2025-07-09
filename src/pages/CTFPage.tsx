import React, { useRef, useCallback } from 'react';
import { CTFTable } from '../components/Table/CTFTable/CTFTable';
import { useCtfQuery } from '@/hooks/useQueries';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { PageContainer } from '@/shared/ui/PageContainer';

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
      <PageContainer vertical>
        <Header title="CTF" />
        <div ref={ctfRef}>
          <CTFTable isLoading={isLoading} data={data?.data ?? []} onChange={onCtfTableChange} />
        </div>
        <Footer />
      </PageContainer>
    </>
  );
};

export default CTFPage;
