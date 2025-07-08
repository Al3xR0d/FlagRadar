import React from 'react';
import { PageContainer } from '@/shared/ui/PageContainer';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { RaitingTable } from '@/components/Table/RaitingTable';

const RaitingPage: React.FC = () => {
  return (
    <>
      <PageContainer vertical>
        <Header title="Рейтинг" />
        <RaitingTable />
        <Footer />
      </PageContainer>
    </>
  );
};

export default RaitingPage;
