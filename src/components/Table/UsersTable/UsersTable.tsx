import React, { useState } from 'react';
import Empty from 'antd/es/empty';
import { User } from '@/types';
import { AntdTable } from '@/shared/ui/Table';
import { CustomSpin } from '@/shared/ui/Spin';
import { Icon } from '@/shared/ui/Icon';
import { ColumnsType } from 'antd/es/table';
import { AntdCancelButton } from '@/shared/ui/CancelButton';

interface Props {
  isLoading: boolean;
  data: User[];
  onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;
}

const columns: ColumnsType<User> = [
  { title: 'UUID', dataIndex: 'uuid', key: 'uuid', align: 'center' },
  { title: 'ЛОГИН', dataIndex: 'nickname', key: 'nickname', align: 'center' },
  { title: 'АТРИБУТ', dataIndex: 'properties', key: 'properties', align: 'center' },
  { title: 'BB SCORE', dataIndex: 'score_bb', key: 'score_bb', align: 'center' },
  { title: 'CTF SCORE', dataIndex: 'score_ctf', key: 'score_ctf', align: 'center' },
  { title: 'КОМАНДА', dataIndex: 'team_id', key: 'team_id', align: 'center' },
  { title: 'SBERPDI', dataIndex: 'sber_pdi', key: 'sber_pdi', align: 'center' },
];

export const UsersTable: React.FC<Props> = ({ isLoading, data, onChange }) => {
  const [selectedUserUuids, setSelectedUserUuids] = useState<string[]>([]);

  // const rowSelection = {
  //   columnTitle: '✔',
  //   selectedRowKeys: selectedUserUuids,
  //   onChange: (selectedRowKeys: React.Key[]) => {
  //     setSelectedUserUuids(selectedRowKeys as string[]);
  //   },
  // };

  return (
    <>
      <AntdTable<User>
        loading={{
          spinning: isLoading,
          indicator: <CustomSpin />,
        }}
        // rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        rowKey="uuid"
        onChange={onChange}
        title={() => (
          <span>
            <Icon className="fas fa-database" $marginRight="8px" />
            Пользователи
          </span>
        )}
        pagination={{ pageSize: 10 }}
        locale={{
          emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет активных пользователей" />
          ),
        }}
        // footer={() => (
        //   <>
        //     <AntdCancelButton
        //       onClick={() => {}}
        //       icon={
        //         <Icon className="fas fa-trash-alt" color="#ffffff" marginRight="8" fontSize="15" />
        //       }
        //       text="Удалить пользователей"
        //       disabled={selectedUserUuids.length === 0}
        //     />
        //   </>
        // )}
      />
    </>
  );
};
