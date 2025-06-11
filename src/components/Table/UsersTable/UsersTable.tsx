import React from 'react';
import Empty from 'antd/es/empty';
import { User } from '@/types';
import { AntdTable } from '@/shared/ui/Table';
import { CustomSpin } from '@/shared/ui/Spin';

interface Props {
  isLoading: boolean;
  data: User[];
  onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;
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

export const UsersTable: React.FC<Props> = ({ isLoading, data, onChange }) => {
  return (
    <AntdTable<User>
      loading={{
        spinning: isLoading,
        indicator: <CustomSpin />,
      }}
      columns={columns}
      dataSource={data}
      rowKey="uuid"
      onChange={onChange}
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
