import React, { useState, useMemo } from 'react';
import Empty from 'antd/es/empty';
import { AntdTable } from '@/shared/ui/Table';
import { Teams } from '@/types';
import { TeamModal } from '@/components/Modal/TeamModal';
import { AntdLink } from '@/shared/ui/Link';

interface Props {
  isLoading: boolean;
  data: Teams[];
}

export const TeamsTable: React.FC<Props> = ({ isLoading, data }) => {
  const [selectedTeam, setSelectedTeam] = useState<Teams | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNameClick = (team: Teams) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTeam(null);
  };

  const transformedData = data.map((team) => ({
    ...team,
    membersCount: team.members.length,
  }));

  const columns = [
    {
      title: 'НАЗВАНИЕ',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Teams) => (
        <AntdLink onClick={() => handleNameClick(record)}>{name}</AntdLink>
      ),
    },
    { title: 'УЧАСТНИКИ', dataIndex: 'membersCount', key: 'membersCount' },
    { title: 'BB SCORE', dataIndex: 'score_bb', key: 'score_bb' },
    { title: 'CTF SCORE', dataIndex: 'score_ctf', key: 'score_ctf' },
  ];

  return (
    <>
      <AntdTable<Teams>
        loading={isLoading}
        columns={columns}
        dataSource={transformedData}
        rowKey="uuid"
        title={() => (
          <span>
            <i className="fas fa-database" style={{ marginRight: 8, color: '#00FF9D' }}></i>
            Команды
          </span>
        )}
        pagination={{ pageSize: 10 }}
        locale={{
          emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет активных команд" />
          ),
        }}
      />
      <TeamModal
        onClose={() => handleModalClose()}
        open={isModalOpen}
        name={selectedTeam?.name}
        token={selectedTeam?.token}
        members={selectedTeam?.members}
      />
    </>
  );
};
