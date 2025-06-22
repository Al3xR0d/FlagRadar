import { FC, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import Space from 'antd/es/space';
import Button from 'antd/es/button';
import Empty from 'antd/es/empty';
import Tag from 'antd/es/tag';
import { Events, EventsStatus } from '@/types/domain/Events';
import { AntdTable } from '@/shared/ui/Table';
import { CTFModal } from '@/components/Modal/CTFModal';
import { AntdLink } from '@/shared/ui/Link';
import { CustomSpin } from '@/shared/ui/Spin';

interface Props {
  isLoading: boolean;
  data: Events[];
  onEdit?: (event: Events) => void;
  onDelete?: (id: string) => void;
}

const STATUS_TAG_COLOR_MAP: Record<EventsStatus, string> = {
  active: 'success',
  pending: 'warning',
  finished: 'default',
  cancelled: 'error',
};

const STATUS_TAG_TEXT_MAP: Record<EventsStatus, string> = {
  active: 'Активно',
  pending: 'Ожидает',
  finished: 'Завершен',
  cancelled: 'Отменён',
};

export const CTFTable: FC<Props> = ({ isLoading, data, onEdit, onDelete }) => {
  const [selectedEvent, setSelectedEvent] = useState<Events | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNameClick = (event: Events) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const columns = useMemo(() => {
    const cs: ColumnsType<Events> = [
      {
        title: 'НАЗВАНИЕ',
        dataIndex: 'name',
        key: 'name',
        render: (name: string, record: Events) => (
          <AntdLink onClick={() => handleNameClick(record)}>{name}</AntdLink>
        ),
      },
      { title: 'ДАТА НАЧАЛА', dataIndex: 'data', key: 'data' },
      { title: 'ФОРМАТ', dataIndex: 'event_format', key: 'eventFormat' },
      {
        title: 'СТАТУС',
        dataIndex: 'status',
        key: 'status',
        render: (_, record: Events) => (
          // <Tag color={STATUS_TAG_COLOR_MAP[record.status]}>
          //   {STATUS_TAG_TEXT_MAP[record.status]}
          // </Tag>
          <Tag color="success">Активно</Tag>
        ),
      },
    ];

    if (onEdit && onDelete) {
      cs.push({
        title: 'ДЕЙСТВИЯ',
        key: 'actions',
        render: (_, record: Events) => (
          <Space size="middle">
            <Button onClick={() => onEdit(record)}>Редактировать</Button>
            <Button danger onClick={() => onDelete(record.uuid)}>
              Удалить
            </Button>
          </Space>
        ),
      });
    }

    return cs;
  }, [onEdit, onDelete]);

  return (
    <>
      <AntdTable<Events>
        // loading={{
        //   spinning: isLoading,
        //   indicator: <CustomSpin />,
        // }}
        loading={isLoading}
        rowKey="uuid"
        columns={columns}
        dataSource={data}
        title={() => (
          <span>
            <i className="fas fa-database" style={{ marginRight: 8, color: '#00FF9D' }} />
            Ближайшие CTF
          </span>
        )}
        pagination={{ pageSize: 10 }}
        locale={{
          emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет активных событий" />
          ),
        }}
      />
      <CTFModal
        onClose={() => handleModalClose()}
        open={isModalOpen}
        name={selectedEvent?.name}
        description={selectedEvent?.description}
        date={selectedEvent?.data}
        dateEnd={selectedEvent?.data_end}
        place={selectedEvent?.place}
        format={selectedEvent?.part_format}
        eventFormat={selectedEvent?.event_format}
        rules={selectedEvent?.ref_rules}
        regStart={selectedEvent?.reg_start}
        regEnd={selectedEvent?.reg_eng}
      />
    </>
  );
};
