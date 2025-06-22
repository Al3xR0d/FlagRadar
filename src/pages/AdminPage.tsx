import React, { useCallback, useState, useEffect } from 'react';
// import { Spin, Divider } from 'antd';
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
} from '@/hooks/useQueries';
import { Header } from '@/components/Layout/Header';
import { Events } from '@/types/domain/Events';
import { CreateCTFModal } from '@/components/Modal/CreateCTFModal';
import { EditCTFModal } from '@/components/Modal/EditCTFModal';
import { AntdButton } from '@/shared/ui/Button';
import Flex from 'antd/es/flex';
import { EditRulesModal } from '@/components/Modal/EditRulesModal';
import { Footer } from '@/components/Layout/Footer';

const AdminPage: React.FC = () => {
  const { data: ctfData, isLoading: isCTFLoading } = useCtfQuery();
  const { data: teamsData, isLoading: teamsLoading } = useTeamsQuery();
  const { data: usersData, isLoading: usersLoading } = useUsersQuery();
  const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();

  const deleteMut = useDeleteCTF();

  const [showCreate, setShowCreate] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [editRec, setEditRec] = useState<Events | null>(null);

  const handleEdit = useCallback((event: Events) => setEditRec(event), []);
  const handleDelete = useCallback((id: Events['uuid']) => deleteMut.mutate(id), []);

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
        <CTFTable
          isLoading={isCTFLoading}
          data={ctfData?.data ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <Divider />
        <TeamsTable isLoading={teamsLoading} data={teamsData?.data ?? []} />
        <Divider />
        <UsersTable isLoading={usersLoading} data={usersData?.data ?? []} />

        <CreateCTFModal open={showCreate} onClose={() => setShowCreate(false)} />
        {editRec && (
          <EditCTFModal open={!!editRec} record={editRec} onClose={() => setEditRec(null)} />
        )}
        <EditRulesModal open={showRules} onClose={() => setShowRules(false)} />
        <Footer />
      </Flex>
    </>
  );
};

export default AdminPage;
