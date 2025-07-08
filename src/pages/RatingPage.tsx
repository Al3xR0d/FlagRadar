import React from 'react';
import { PageContainer } from '@/shared/ui/PageContainer';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { RaitingTable } from '@/components/Table/RaitingTable';

const RaitingPage: React.FC = () => {
  const isLoading = false; //// Заменить на сетевой запрос;

  return (
    <>
      <PageContainer vertical>
        <Header title="Рейтинг" />
        <RaitingTable isLoading={isLoading} />
        <Footer />
      </PageContainer>
    </>
  );
};

export default RaitingPage;
