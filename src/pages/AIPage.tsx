import React from 'react';
import { PageContainer } from '@/shared/ui/PageContainer';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

const AIPage: React.FC = () => {
  return (
    <>
      <PageContainer vertical>
        <Header title="AI Помощник" />
        <Footer />
      </PageContainer>
    </>
  );
};

export default AIPage;
