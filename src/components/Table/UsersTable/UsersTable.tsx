import React from 'react';
import Empty from 'antd/es/empty';
import { User } from '@/types';
import { AntdTable } from '@/shared/ui/Table';

interface Props {
  isLoading: boolean;
  data: User[];
}

const columns = [
  { title: 'UUID', dataIndex: 'uuid', key: 'uuid' },
  { title: 'ЛОГИН', dataIndex: 'nickname', key: 'nickname' },
  { title: 'АТРИБУТ', dataIndex: 'properties', key: 'properties' },
  { title: 'BB SCORE', dataIndex: 'score_bb', key: 'score_bb' },
  { title: 'CTF SCORE', dataIndex: 'score_ctf', key: 'score_ctf' },
  { title: 'КОМАНДА', dataIndex: 'team_id', key: 'team_id' },
  { title: 'SBERPDI', dataIndex: 'sber_pdi', key: 'sber_pdi' },
];

export const UsersTable: React.FC<Props> = ({ isLoading, data }) => {
  return (
    <AntdTable<User>
      loading={isLoading}
      columns={columns}
      dataSource={data}
      rowKey="uuid"
      title={() => (
        <span>
          <i className="fas fa-database" style={{ marginRight: 8, color: '#00FF9D' }}></i>
          Пользователи
        </span>
      )}
      pagination={{ pageSize: 10 }}
      locale={{
        emptyText: (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет активных пользователей" />
        ),
      }}
    />
  );
};
