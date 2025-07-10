import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Divider from 'antd/es/divider';
import { CTFTable } from '@/components/Table/CTFTable';
import { TeamsTable } from '@/components/Table/TeamsTable';
import { UsersTable } from '@/components/Table/UsersTable';
import {
  useCtfQuery,
  useDeleteCTF,
  useTeamsQuery,
  useUsersQuery,
  useFetchRules,
} from '@/hooks/useQueries';
import { Header } from '@/components/Layout/Header';
import { Events } from '@/types/domain/Events';
import { CreateCTFModal } from '@/components/Modal/CreateCTFModal';
import { EditCTFModal } from '@/components/Modal/EditCTFModal';
import { AntdButton } from '@/shared/ui/Button';
import Flex from 'antd/es/flex';
import { EditRulesModal } from '@/components/Modal/EditRulesModal';
import { Footer } from '@/components/Layout/Footer';
import message from 'antd/es/message';
import { DeleteCTFModal } from '@/components/Modal/DeleteCTFModal';
import { Icon } from '@/shared/ui/Icon';
import { PageContainer } from '@/shared/ui/PageContainer';
import { AcceptUserModal } from '@/components/Modal/AcceptUserModal';
import { useUserStore } from '@/store/userStore';

const Wrapper = styled.span`
  margin-bottom: 10px;
`;

const AdminPage: React.FC = () => {
  const { data: ctfData, isLoading: isCTFLoading, error: ctfError } = useCtfQuery();
  const { data: teamsData, isLoading: teamsLoading } = useTeamsQuery();
  const { data: usersData, isLoading: usersLoading } = useUsersQuery();
  const { data: rulesData, isLoading: rulesLoading } = useFetchRules();

  const deleteMut = useDeleteCTF();

  const currentUser = useUserStore((store) => store.currentUser);

  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [editRec, setEditRec] = useState<Events | null>(null);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showAcceptUserModal, setShowAcceptUserModal] = useState<boolean>(false);

  const ctfRef = useRef<HTMLDivElement>(null);
  const teamsRef = useRef<HTMLDivElement>(null);
  const usersRef = useRef<HTMLDivElement>(null);

  const handleEdit = useCallback((event: Events) => setEditRec(event), []);
  const handleDelete = useCallback((id: Events['uuid']) => {
    setToDeleteId(id);
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = () => {
    if (toDeleteId) {
      deleteMut.mutate(toDeleteId, {
        onSuccess: () => {
          message.success('CTF успешно удалён');
          setShowDeleteModal(false);
          setToDeleteId(null);
        },
        onError: () => {
          message.error('Ошибка при удалении CTF');
        },
      });
    }
  };

  const scrollToRef = (ref: typeof ctfRef) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onCtfTableChange = useCallback(() => {
    scrollToRef(ctfRef);
  }, []);

  const onTeamsTableChange = useCallback(() => {
    scrollToRef(teamsRef);
  }, []);

  const onUsersTableChange = useCallback(() => {
    scrollToRef(usersRef);
  }, []);

  useEffect(() => {
    if (ctfError && ctfError.status === 451) {
      setShowAcceptUserModal(true);
    }
  }, [ctfError]);

  const existingNickname = currentUser?.nickname;

  return (
    <>
      <PageContainer vertical>
        <Header
          title="Админошная"
          button={
            <Wrapper>
              <Flex gap="small">
                <AntdButton
                  disabled={isCTFLoading}
                  loading={isCTFLoading}
                  onClick={() => setShowCreate(true)}
                  icon={
                    <Icon
                      className="fa-solid fa-plus"
                      color="#0e0e14"
                      marginRight="0"
                      fontSize="15"
                    />
                  }
                  text={' Создать CTF'}
                />
                <AntdButton
                  disabled={isCTFLoading}
                  loading={isCTFLoading}
                  icon={
                    <Icon className="fas fa-edit" color="#0e0e14" marginRight="0" fontSize="13" />
                  }
                  text={' Правила платформы'}
                  onClick={() => setShowRules(true)}
                />
              </Flex>
            </Wrapper>
          }
        />
        <div ref={ctfRef}>
          <CTFTable
            isLoading={isCTFLoading}
            data={ctfData?.data ?? []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onChange={onCtfTableChange}
            showResultsColumn={true}
          />
        </div>
        <Divider />
        <div ref={teamsRef}>
          <TeamsTable
            isLoading={teamsLoading}
            data={teamsData?.data ?? []}
            onChange={onTeamsTableChange}
          />
        </div>
        <Divider />
        <div ref={usersRef}>
          <UsersTable
            isLoading={usersLoading}
            data={usersData?.data ?? []}
            onChange={onUsersTableChange}
          />
        </div>
        {showCreate && <CreateCTFModal open={showCreate} onClose={() => setShowCreate(false)} />}

        {editRec && (
          <EditCTFModal open={!!editRec} record={editRec} onClose={() => setEditRec(null)} />
        )}
        {showRules && (
          <EditRulesModal
            open={showRules}
            onClose={() => setShowRules(false)}
            text={rulesData?.text ? rulesData?.text : ''}
          />
        )}
        {showDeleteModal && (
          <DeleteCTFModal
            open={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setToDeleteId(null);
            }}
            onClick={handleConfirmDelete}
          />
        )}
        <Footer />
      </PageContainer>
      {showAcceptUserModal && (
        <AcceptUserModal
          open={showAcceptUserModal}
          onClose={() => {
            setShowAcceptUserModal(false);
          }}
          isExistingUser={!!existingNickname}
          existingNickname={existingNickname}
        />
      )}
    </>
  );
};

export default AdminPage;
