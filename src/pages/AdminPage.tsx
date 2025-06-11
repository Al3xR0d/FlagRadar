import React, { useCallback, useState, useEffect, useRef } from 'react';
import Divider from 'antd/es/divider';
import { CTFTable } from '@/components/Table/CTFTable';
import { TeamsTable } from '@/components/Table/TeamsTable';
import { UsersTable } from '@/components/Table/UsersTable';
import {
  useCtfQuery,
  useDeleteCTF,
  useTeamsQuery,
  useUsersQuery,
  useCurrentUser,
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

const AdminPage: React.FC = () => {
  const { data: ctfData, isLoading: isCTFLoading } = useCtfQuery();
  const { data: teamsData, isLoading: teamsLoading } = useTeamsQuery();
  const { data: usersData, isLoading: usersLoading } = useUsersQuery();
  const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();
  const { data: rulesData, isLoading: rulesLoading } = useFetchRules();

  const deleteMut = useDeleteCTF();

  const [showCreate, setShowCreate] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [editRec, setEditRec] = useState<Events | null>(null);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  return (
    <>
      <Flex vertical style={{ minHeight: '100vh' }}>
        <Header
          title="Админошная"
          button={
            <span
              style={{
                marginBottom: '10px',
              }}
            >
              <Flex gap="small">
                <AntdButton
                  disabled={isCTFLoading}
                  loading={isCTFLoading}
                  onClick={() => setShowCreate(true)}
                  icon={<i className="fa-solid fa-plus" style={{ marginRight: 8 }} />}
                  text={'Создать CTF'}
                />
                <AntdButton
                  icon={<i className="fas fa-edit" />}
                  text={'Правила платформы'}
                  onClick={() => setShowRules(true)}
                />
              </Flex>
            </span>
          }
        />
        <div ref={ctfRef}>
          <CTFTable
            isLoading={isCTFLoading}
            data={ctfData?.data ?? []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onChange={onCtfTableChange}
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
        <CreateCTFModal open={showCreate} onClose={() => setShowCreate(false)} />
        {editRec && (
          <EditCTFModal open={!!editRec} record={editRec} onClose={() => setEditRec(null)} />
        )}
        <EditRulesModal
          open={showRules}
          onClose={() => setShowRules(false)}
          text={rulesData?.text ? rulesData?.text : ''}
        />
        <Footer />
        <DeleteCTFModal
          open={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setToDeleteId(null);
          }}
          onClick={handleConfirmDelete}
        />
      </Flex>
    </>
  );
};

export default AdminPage;
