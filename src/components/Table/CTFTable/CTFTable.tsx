import React, { FC, useMemo, useState, memo, useRef, useEffect } from 'react';
import { ColumnsType } from 'antd/es/table';
import Space from 'antd/es/space';
import Empty from 'antd/es/empty';
import Flex from 'antd/es/flex';
import message from 'antd/es/message';
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
import { Icon } from '@/shared/ui/Icon';
import { ResultsModal } from '@/components/Modal/ResultsModal';
import { DeleteResultsModal } from '@/components/Modal/DeleteResultsModal';
import { useCreateJWT } from '@/hooks/useQueries';
import { CreateJWTModal } from '@/components/Modal/CreateJWTModal';
import { downloadJson } from '@/services/Api';
import { getFileNameFromContentDisposition } from '@/lib/downloadFiles';

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
    const [isModalCreateJWTOpen, setIsModalCreateJWTOpen] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [displayData, setDisplayData] = useState<Events[]>(data || []);
    const prevDataRef = useRef<Events[] | null>(null);

    const teamId = useUserStore((store) => store.teamId);

    const { mutate: fetchResults } = useUploadResults();
    const {
      data: results,
      isLoading: isResultsLoading,
      isError: isResultsError,
      error: resultsError,
    } = usefetchResults({
      eventId: selectedEvent?.uuid || '',
    });

    const {
      mutate: generateJWT,
      data: jwtResponse,
      isLoading: isJWTLoading,
      error: jwtError,
    } = useCreateJWT();

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

    useEffect(() => {
      const incoming = data || [];
      if (!prevDataRef.current) {
        setDisplayData(incoming);
        prevDataRef.current = incoming;
        return;
      }

      const prev = prevDataRef.current || [];
      const prevMap = new Map(prev.map((item) => [item.uuid, JSON.stringify(item)]));
      const currMap = new Map(incoming.map((item) => [item.uuid, JSON.stringify(item)]));

      const added = incoming.filter((item) => !prevMap.has(item.uuid));

      const updated = incoming.filter(
        (item) => prevMap.has(item.uuid) && prevMap.get(item.uuid) !== currMap.get(item.uuid),
      );

      if (added.length === 0 && updated.length === 0) {
        setDisplayData(incoming);
        prevDataRef.current = incoming;
        return;
      }

      const addedIds = new Set(added.map((added) => added.uuid));
      const updatedIds = new Set(updated.map((updated) => updated.uuid));

      const newFront: Events[] = [
        ...added,
        ...updated.filter((updated) => !addedIds.has(updated.uuid)),
      ];

      const rest = incoming.filter(
        (item) => !addedIds.has(item.uuid) && !updatedIds.has(item.uuid),
      );

      setDisplayData([...newFront, ...rest]);
      prevDataRef.current = incoming;
    }, [data]);

    const handleDownloadJson = async (record: Events) => {
      if (!record?.uuid) {
        message.error('Не указан id события');
        return;
      }

      try {
        const res: any = await downloadJson(record.uuid);

        const blob: Blob =
          res?.data instanceof Blob
            ? res.data
            : res instanceof Blob
            ? res
            : new Blob([res?.data ?? res], { type: 'application/json' });

        const headers = res?.headers ?? {};
        const cdHeader = headers['content-disposition'] ?? headers['Content-Disposition'] ?? null;
        const filenameFromHeader = getFileNameFromContentDisposition(cdHeader);
        const safeName =
          filenameFromHeader ||
          `${(record.name || record.uuid).replace(/[^a-z0-9\-_.]/gi, '_')}-participants.json`;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = safeName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        message.success('Скачивание началось');
      } catch (err: any) {
        console.error('downloadJson error', err);
        if (err?.response?.data) {
          try {
            const text = await err.response.data.text?.();
            console.warn('response body:', text);
          } catch {}
        }
        message.error('Не удалось скачать JSON');
      }
    };

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
                    <Flex gap="small">
                      <AntdButton
                        onClick={() => onEdit(record)}
                        icon={<i className="fas fa-edit" />}
                        disabled={isEditDisabled}
                        compact
                        showTooltip={true}
                        tooltipText="Редактировать CTF"
                      />
                      <AntdButton
                        onClick={() => handleDownloadJson(record)}
                        icon={<i className="fa fa-download" />}
                        compact
                        showTooltip={true}
                        tooltipText="Скачать JSON"
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
                if (isCaptain && status === EventsStatus.ACTIVE) {
                  const isParticipating = isUserParticipating(record.name);
                  return (
                    <Space size="middle">
                      {isParticipating && (
                        <AntdButton
                          onClick={() => {
                            handleSaveCTF(record);
                            if (!teamId) {
                              message.error('teamId отсутствует');
                              return;
                            }

                            try {
                              generateJWT(teamId, {
                                onSuccess: () => {
                                  setIsModalCreateJWTOpen(true);
                                },
                                onError: (err: any) => {
                                  console.error('JWT generation failed', err);
                                  message.error('Не удалось сгенерировать JWT');
                                },
                              });
                            } catch (err) {
                              console.error('generateJWT error', err);
                              message.error('Не удалось инициировать генерацию JWT');
                            }
                          }}
                          text="Генерация JWT"
                          disabled={!teamId || isJWTLoading}
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

      return [...baseColumns, ...resultsColumn, ...actionsColumn];
    }, [
      isCaptain,
      onEdit,
      onDelete,
      userEvents,
      showResultsColumn,
      teamId,
      generateJWT,
      isJWTLoading,
    ]);

    return (
      <>
        <AntdTable<Events>
          loading={{
            spinning: isLoading,
            indicator: <CustomSpin />,
          }}
          rowKey="uuid"
          columns={columns}
          dataSource={displayData}
          onChange={onChange}
          title={() => (
            <span>
              <Icon className="fas fa-database" $marginRight="8px" />
              Список CTF
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
            privateCtf={selectedEvent?.is_private}
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
        {isModalCreateJWTOpen && (
          <CreateJWTModal
            open={isModalCreateJWTOpen}
            onCancel={() => setIsModalCreateJWTOpen(false)}
            JWT={jwtResponse.data}
            isLoading={isJWTLoading}
          />
        )}
      </>
    );
  },
);

CTFTable.displayName = 'CTFTable';
