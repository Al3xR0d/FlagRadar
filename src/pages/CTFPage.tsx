import React, { useRef, useCallback, useState, useEffect } from 'react';
import { CTFTable } from '@/components/Table/CTFTable/CTFTable';
import { useCtfQuery } from '@/hooks/useQueries';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { PageContainer } from '@/shared/ui/PageContainer';
import { AcceptUserModal } from '@/components/Modal/AcceptUserModal';
import { useUserStore } from '@/store/userStore';

const CTFPage: React.FC = () => {
  const { data, isLoading, error } = useCtfQuery();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const ctfRef = useRef<HTMLDivElement>(null);
  const currentUser = useUserStore((store) => store.currentUser);

  const scrollToRef = (ref: typeof ctfRef) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onCtfTableChange = useCallback(() => {
    scrollToRef(ctfRef);
  }, []);

  useEffect(() => {
    if (error && error.status === 451) {
      setIsModalOpen(true);
    }
  }, [error]);

  const existingNickname = currentUser?.nickname;

  return (
    <>
      <PageContainer vertical>
        <Header title="CTF" />
        <div ref={ctfRef}>
          <CTFTable isLoading={isLoading} data={data?.data ?? []} onChange={onCtfTableChange} />
        </div>
        <Footer />
      </PageContainer>
      {isModalOpen && (
        <AcceptUserModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isExistingUser={!!existingNickname}
          existingNickname={existingNickname}
        />
      )}
    </>
  );
};

export default CTFPage;
