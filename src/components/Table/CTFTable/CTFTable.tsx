import React, { FC, useMemo, useState, memo, useRef, useEffect } from 'react';
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
import { formatDateToDefaultFormatMsk } from '@/lib/date';
import { JoinCTFModal } from '@/components/Modal/JoinCTFModal';
import { LeaveCTFModal } from '@/components/Modal/LeaveCTFModal';
import { useUploadResults, usefetchResults } from '@/hooks/useQueries';
import { editNameFormat, NameType } from '@/lib/name';
import Flex from 'antd/es/flex';
import { Icon } from '@/shared/ui/Icon';
import message from 'antd/es/message';
import { ResultsModal } from '@/components/Modal/ResultsModal';
import { DeleteResultsModal } from '@/components/Modal/DeleteResultsModal';

interface Props {
  isLoading: boolean;
  data: Events[];
  onEdit?: (event: Events) => void;
  onDelete?: (id: string) => void;
  onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;
  showResultsColumn?: boolean;
}

export const CTFTable: FC<Props> = memo(
  ({ isLoading, data, onEdit, onDelete, onChange, showResultsColumn }) => {
    const [selectedEvent, setSelectedEvent] = useState<Events | null>(null);
    const [isModalEditOpen, setIsModalEditOpen] = useState<boolean>(false);
    const [isModalJoinOpen, setIsModalJoinOpen] = useState<boolean>(false);
    const [isModalLeaveOpen, setIsModalLeaveOpen] = useState<boolean>(false);
    const [isModalResultsOpen, setIsModalResultsOpen] = useState<boolean>(false);
    const [isModalDeleteResultsOpen, setIsModalDeleteResultOpen] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { mutate: fetchResults } = useUploadResults();
    const {
      data: results,
      isLoading: isResultsLoading,
      isError: isResultsError,
      error: resultsError,
    } = usefetchResults({
      eventId: selectedEvent?.uuid || '',
    });

    const user = useUserStore((store) => store.currentUser);
    const isCaptain = user?.properties === 'captain';
    const isOrg = user?.properties === 'org';
    const userEvents = user?.events || [];

    const getEventStatus = (event: Events, now: Date): EventsStatus => {
      const regStart = new Date(event.reg_start).getTime();
      const regEnd = new Date(event.reg_end).getTime();
      const start = new Date(event.date).getTime();
      const end = new Date(event.date_end).getTime();
      const nowTime = now.getTime();

      if (nowTime < regStart) {
        return EventsStatus.PENDING;
      } else if (nowTime >= regStart && nowTime < regEnd) {
        return EventsStatus.REGISTRATION;
      } else if (nowTime >= start) {
        if (nowTime < end) {
          return EventsStatus.ACTIVE;
        } else {
          return EventsStatus.FINISHED;
        }
      } else {
        return EventsStatus.PENDING;
      }
    };

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

    const handleResults = (event: Events) => {
      setSelectedEvent(event);
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !selectedEvent) return;

      if (!file.name.endsWith('.json')) {
        message.error('Пожалуйста, загрузите файл в формате .json');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          const modifiedJsonData = {
            ...jsonData,
            links: jsonData.links ?? [''],
            tasks: jsonData.tasks ?? null,
          };

          fetchResults(
            { eventId: selectedEvent.uuid, jsonData: modifiedJsonData },
            {
              onSuccess: (data: { result: string; msg?: string }) => {
                if (data.result === 'Err') {
                  message.error(data.msg || 'Неизвестная ошибка');
                } else {
                  message.success('Данные успешно загружены');
                }
              },
              onError: (error: any) => {
                console.error('Ошибка загрузки данных:', error.response?.data || error.message);
                message.error(
                  `Ошибка загрузки данных: ${
                    error.response?.data?.message || 'Неизвестная ошибка'
                  }`,
                );
              },
            },
          );
        } catch (err) {
          message.error('Файл содержит невалидный JSON');
        }
      };
      reader.onerror = () => {
        message.error('Ошибка чтения файла');
      };
      reader.readAsText(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    useEffect(() => {
      if (isResultsError && resultsError) {
        message.error('Ошибка при загрузке результатов');
      }
    }, [isResultsError, resultsError]);

    const columns = useMemo(() => {
      const baseColumns: ColumnsType<Events> = [
        {
          title: 'НАЗВАНИЕ',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          render: (name: string, record: Events) => (
            <AntdLink onClick={() => handleNameClick(record)}>{name}</AntdLink>
          ),
        },
        {
          title: 'ДАТА НАЧАЛА',
          dataIndex: 'date',
          key: 'date',
          align: 'center',
          render: (date: string) => formatDateToDefaultFormatMsk(date),
        },
        {
          title: 'ФОРМАТ',
          dataIndex: 'event_format',
          key: 'eventFormat',
          align: 'center',
          render: (format: string) => editNameFormat(format as NameType),
        },
        {
          title: 'СТАТУС',
          dataIndex: 'status',
          key: 'status',
          align: 'center',
          render: (_, record: Events) => {
            const now = new Date();
            const status = getEventStatus(record, now);
            return <Tags $status={status} />;
          },
        },
      ];

      const shouldShowActions = isCaptain || (onEdit && onDelete);
      const actionsColumn: ColumnsType<Events> = shouldShowActions
        ? [
            {
              title: 'ДЕЙСТВИЯ',
              key: 'actions',
              align: 'center',
              render: (_, record: Events) => {
                const status = getEventStatus(record, new Date()) as EventsStatus;
                if (onEdit && onDelete) {
                  const isEditDisabled = status === EventsStatus.FINISHED;
                  return (
                    <Flex gap="middle">
                      <AntdButton
                        onClick={() => onEdit(record)}
                        icon={<i className="fas fa-edit" />}
                        disabled={isEditDisabled}
                        compact
                        showTooltip={true}
                        tooltipText="Редактировать CTF"
                      />
                      <AntdCancelButton
                        onClick={() => onDelete(record.uuid)}
                        icon={<i className="fas fa-trash-alt" />}
                        compact
                        showTooltip={true}
                        tooltipText="Удалить CTF"
                      />
                    </Flex>
                  );
                }
                if (isCaptain && status === EventsStatus.REGISTRATION) {
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
                }
                return null;
              },
            },
          ]
        : [];

      const resultsColumn: ColumnsType<Events> = showResultsColumn
        ? [
            {
              title: 'РЕЗУЛЬТАТЫ',
              key: 'results',
              align: 'center',
              render: (_, record: Events) => {
                const status = getEventStatus(record, new Date()) as EventsStatus;
                const isResultsDisabled = status !== EventsStatus.FINISHED;

                return (
                  <Flex gap="small">
                    <AntdButton
                      onClick={() => handleResults(record)}
                      disabled={isResultsDisabled}
                      icon={<i className="fa fa-external-link" />}
                      compact
                      showTooltip={true}
                      tooltipText="Загрузить результаты"
                    />
                    <AntdButton
                      onClick={() => {
                        setSelectedEvent(record);
                        setIsModalResultsOpen(true);
                      }}
                      disabled={isResultsDisabled}
                      icon={<i className="fa fa-tasks" />}
                      compact
                      showTooltip={true}
                      tooltipText="Показать результаты"
                    />
                    <AntdCancelButton
                      onClick={() => {
                        setSelectedEvent(record);
                        setIsModalDeleteResultOpen(true);
                      }}
                      disabled={isResultsDisabled}
                      icon={<i className="fas fa-trash-alt" />}
                      compact
                      showTooltip={true}
                      tooltipText="Удалить результаты"
                    />
                  </Flex>
                );
              },
            },
          ]
        : [];

      return [...baseColumns, ...actionsColumn, ...resultsColumn];
    }, [isCaptain, onEdit, onDelete, userEvents, showResultsColumn]);

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
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".json"
          onChange={handleFileUpload}
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
        {isModalResultsOpen && results && (
          <ResultsModal
            open={isModalResultsOpen}
            results={results}
            isLoading={isResultsLoading}
            isError={isResultsError}
            onClose={() => {
              setIsModalResultsOpen(false);
            }}
          />
        )}
        {isModalDeleteResultsOpen && (
          <DeleteResultsModal
            open={isModalDeleteResultsOpen}
            onClose={() => setIsModalDeleteResultOpen(false)}
            eventId={selectedEvent?.uuid}
          />
        )}
      </>
    );
  },
);
