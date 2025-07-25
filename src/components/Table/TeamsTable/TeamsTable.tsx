import React, { useState } from 'react';
import Empty from 'antd/es/empty';
import { AntdTable } from '@/shared/ui/Table';
import { Teams } from '@/types';
import { TeamModal } from '@/components/Modal/TeamModal';
import { AntdLink } from '@/shared/ui/Link';
import { CustomSpin } from '@/shared/ui/Spin';
import { Icon } from '@/shared/ui/Icon';
import { ColumnsType } from 'antd/es/table';

interface Props {
  isLoading: boolean;
  data: Teams[];
  onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;
}

export const TeamsTable: React.FC<Props> = ({ isLoading, data, onChange }) => {
  const [selectedTeam, setSelectedTeam] = useState<Teams | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

  const columns: ColumnsType<Teams> = [
    {
      title: 'НАЗВАНИЕ',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (name: string, record: Teams) => (
        <AntdLink onClick={() => handleNameClick(record)}>{name}</AntdLink>
      ),
    },
    { title: 'УЧАСТНИКИ', dataIndex: 'membersCount', key: 'membersCount', align: 'center' },
    { title: 'BB SCORE', dataIndex: 'score_bb', key: 'score_bb', align: 'center' },
    { title: 'CTF SCORE', dataIndex: 'score_ctf', key: 'score_ctf', align: 'center' },
  ];

  return (
    <>
      <AntdTable<Teams>
        loading={{
          spinning: isLoading,
          indicator: <CustomSpin />,
        }}
        columns={columns}
        dataSource={transformedData}
        rowKey="uuid"
        onChange={onChange}
        title={() => (
          <span>
            <Icon className="fas fa-database" marginRight="8" />
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
      {isModalOpen && (
        <TeamModal
          onClose={() => handleModalClose()}
          open={isModalOpen}
          name={selectedTeam?.name}
          token={selectedTeam?.token}
          members={selectedTeam?.members}
        />
      )}
    </>
  );
};
