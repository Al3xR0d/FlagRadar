import { FC, useMemo, useState, memo } from 'react';
import { ColumnsType } from 'antd/es/table';
import Space from 'antd/es/space';
import Empty from 'antd/es/empty';
import { Events, EventsStatus } from '@/types/domain/Events';
import { AntdTable } from '@/shared/ui/Table';
import { CTFModal } from '@/components/Modal/CTFModal';
import { AntdLink } from '@/shared/ui/Link';
import { CustomSpin } from '@/shared/ui/Spin';
import { AntdButton } from '@/shared/ui/Button';
import { AntdCancelButton } from '@/shared/ui/CancelButton';
import { Tags } from '@/shared/ui/Tags';
import { useUserStore } from '@/store/userStore';
import { formatTime } from '@/helpers/helpers';
import { JoinCTFModal } from '@/components/Modal/JoinCTFModal';
import { LeaveCTFModal } from '@/components/Modal/LeaveCTFModal';
import { editNameFormat, nameType } from '@/helpers/helpers';
import Flex from 'antd/es/flex';
import { Icon } from '@/shared/ui/Icon';

interface Props {
  isLoading: boolean;
  data: Events[];
  onEdit?: (event: Events) => void;
  onDelete?: (id: string) => void;
  onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;
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

export const CTFTable: FC<Props> = memo(({ isLoading, data, onEdit, onDelete, onChange }) => {
  const [selectedEvent, setSelectedEvent] = useState<Events | null>(null);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalJoinOpen, setIsModalJoinOpen] = useState(false);
  const [isModalLeaveOpen, setIsModalLeaveOpen] = useState(false);

  const user = useUserStore((store) => store.currentUser);
  const isCaptain = user?.properties === 'captain';
  const userEvents = user?.events || [];

  const isUserParticipating = (eventId: string) => {
    return userEvents.includes(eventId);
  };

  const handleNameClick = (event: Events) => {
    setSelectedEvent(event);
    setIsModalEditOpen(true);
  };

  const handleSaveCTF = (event: Events) => {
    setSelectedEvent(event);
  };

  const handleModalEditClose = () => {
    setIsModalEditOpen(false);
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
      {
        title: 'ДАТА НАЧАЛА',
        dataIndex: 'date',
        key: 'date',
        render: (data: string) => formatTime(data),
      },
      {
        title: 'ФОРМАТ',
        dataIndex: 'event_format',
        key: 'eventFormat',
        render: (format: string) => editNameFormat(format as nameType),
      },
      {
        title: 'СТАТУС',
        dataIndex: 'status',
        key: 'status',
        render: (_, record: Events) => {
          return <Tags $status={EventsStatus.ACTIVE} />;
        },
      },
    ];

    if (onEdit && onDelete) {
      cs.push({
        title: 'ДЕЙСТВИЯ',
        key: 'actions',
        render: (_, record: Events) => (
          <Flex gap="middle">
            <AntdButton onClick={() => onEdit(record)} text="Редактировать" />
            <AntdCancelButton onClick={() => onDelete(record.uuid)} text="Удалить" />
          </Flex>
        ),
      });
    }

    if (isCaptain) {
      cs.push({
        title: 'ДЕЙСТВИЯ',
        key: 'actions',
        render: (_, record: Events) => {
          const isParticipating = isUserParticipating(record.name);

          return (
            <Space size="middle">
              {!isParticipating && (
                <AntdButton
                  onClick={() => {
                    handleSaveCTF(record);
                    setIsModalJoinOpen(true);
                  }}
                  compact={false}
                  text="Участвовать"
                />
              )}
              {isParticipating && (
                <AntdCancelButton
                  onClick={() => {
                    handleSaveCTF(record);
                    setIsModalLeaveOpen(true);
                  }}
                  text="Покинуть CTF"
                />
              )}
            </Space>
          );
        },
      });
    }

    return cs;
  }, [onEdit, onDelete, isCaptain, userEvents]);

  return (
    <>
      <AntdTable<Events>
        loading={{
          spinning: isLoading,
          indicator: <CustomSpin />,
        }}
        rowKey="uuid"
        columns={columns}
        dataSource={data}
        onChange={onChange}
        title={() => (
          <span>
            <Icon className="fas fa-database" marginRight="8" />
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
      {isModalEditOpen && (
        <CTFModal
          onClose={() => handleModalEditClose()}
          open={isModalEditOpen}
          name={selectedEvent?.name}
          description={selectedEvent?.description}
          date={selectedEvent?.date}
          dateEnd={selectedEvent?.date_end}
          place={selectedEvent?.place}
          format={selectedEvent?.part_format}
          eventFormat={selectedEvent?.event_format}
          rules={selectedEvent?.ref_rules}
          regStart={selectedEvent?.reg_start}
          regEnd={selectedEvent?.reg_end}
          eventId={selectedEvent?.uuid}
        />
      )}
      {isModalJoinOpen && (
        <JoinCTFModal
          onClose={() => setIsModalJoinOpen(false)}
          open={isModalJoinOpen}
          eventId={selectedEvent?.uuid}
        />
      )}
      {isModalLeaveOpen && (
        <LeaveCTFModal
          onClose={() => setIsModalLeaveOpen(false)}
          open={isModalLeaveOpen}
          eventId={selectedEvent?.uuid}
        />
      )}
    </>
  );
});
