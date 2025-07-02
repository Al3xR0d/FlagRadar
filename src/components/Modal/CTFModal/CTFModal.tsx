import Modal from 'antd/es/modal/Modal';
import { AntdClose } from '@/shared/ui/Close';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import { AntdLink } from '@/shared/ui/Link';
import { useEventById } from '@/hooks/useQueries';
import { useUserStore } from '@/store/userStore';
import { formatTime } from '@/helpers/helpers';
import { editNameFormat, nameType } from '@/helpers/helpers';
import { CustomSpin } from '@/shared/ui/Spin';
import { useUsersQuery } from '@/hooks/useQueries';
import { AntdTable } from '@/shared/ui/Table';

interface Props {
  open: boolean;
  onClose: () => void;
  name?: string;
  description?: string;
  date?: string;
  dateEnd?: string;
  place?: string;
  format?: string;
  eventFormat?: string;
  rules?: string;
  regStart?: string;
  regEnd?: string;
  eventId?: string;
}

export const CTFModal: React.FC<Props> = ({
  open,
  onClose,
  name,
  description,
  date,
  dateEnd,
  eventFormat,
  format,
  place,
  rules,
  regStart,
  regEnd,
  eventId,
}) => {
  const { data, isLoading } = useEventById(eventId);
  const currentUser = useUserStore((store) => store.currentUser);
  const isAdmin = currentUser?.properties === 'org';

  const { data: usersData, isLoading: isUsersLoading } = useUsersQuery({
    enabled: isAdmin,
  });

  const participants = (name && usersData?.data.filter((user) => user.events.includes(name))) || [];

  const uniqueTeamIds = [...new Set(participants.map((user) => user.team_id).filter(Boolean))];

  const participantRows = participants.map((user) => ({
    key: user.uuid,
    nickname: user.nickname,
    sber_pdi: user.sber_pdi,
  }));

  const participantColumns = [
    {
      title: 'Логин',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: 'SberPDI',
      dataIndex: 'sber_pdi',
      key: 'sber_pdi',
    },
  ];

  const cardData = [
    { title: 'НАЗВАНИЕ', content: name },
    { title: 'ОПИСАНИЕ', content: description },
    ...(date ? [{ title: 'ДАТА НАЧАЛА', content: formatTime(date) }] : []),
    ...(dateEnd ? [{ title: 'ДАТА ОКОНЧАНИЯ', content: formatTime(dateEnd) }] : []),
    { title: 'МЕСТО ПРОВЕДЕНИЯ', content: place },
    { title: 'ФОРМАТ', content: format },
    {
      title: 'ФОРМАТ CTF',
      content: editNameFormat(eventFormat as nameType),
    },
    { title: 'ПРАВИЛА', content: rules, isLink: true },
    ...(regStart ? [{ title: 'НАЧАЛО РЕГИСТРАЦИИ', content: formatTime(regStart) }] : []),
    ...(regEnd ? [{ title: 'ОКОНЧАНИЕ РЕГИСТРАЦИИ', content: formatTime(regEnd) }] : []),
    ...(isAdmin && (data?.tokens?.length || data?.tokens?.length === 0)
      ? [
          {
            title: 'ТОКЕНЫ',
            content: data?.tokens?.length ? data.tokens.join('\n') : 'Токены отсутствуют',
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            title: 'КОМАНДЫ',
            content:
              uniqueTeamIds.length > 0 ? (
                <div style={{ whiteSpace: 'pre-line' }}>{uniqueTeamIds.join('\n')}</div>
              ) : (
                'Пока нет зарегистрированных команд'
              ),
          },
          {
            title: 'УЧАСТНИКИ',
            content:
              participants.length > 0 ? (
                <AntdTable
                  dataSource={participantRows}
                  columns={participantColumns}
                  pagination={false}
                  size="small"
                />
              ) : (
                'Пока нет зарегистрированных участников'
              ),
          },
        ]
      : []),
  ];

  if (isLoading) {
    return <CustomSpin />;
  }

  return (
    <>
      <Modal
        centered
        open={open}
        onCancel={onClose}
        title={<span style={{ color: '#e0e0ff' }}>{name}</span>}
        closeIcon={<AntdClose />}
        destroyOnHidden
        maskClosable={false}
        width={1100}
        styles={{
          header: {
            background: '#151522',
            color: '#e0e0ff',
          },
          body: {
            background: '#151522',
            color: '#e0e0ff',
          },
          content: {
            background: '#151522',
          },
          mask: { backdropFilter: 'blur(5px)' },
        }}
        footer={null}
      >
        <div style={{ padding: '16px 0' }}>
          <Row gutter={[16, 16]}>
            {cardData.map((card, index) => (
              <Col key={index} xs={24} sm={12} md={8} style={{ display: 'flex' }}>
                <Card
                  title={<span style={{ color: '#8a8aa8' }}>{card.title}</span>}
                  style={{
                    background: '#0e0e14',
                    border: '1px solid #25253a',
                    color: '#e0e0ff',
                    flex: 1,
                  }}
                  styles={{
                    header: {
                      borderBottom: 'none',
                      padding: '0 16px',
                      background: '#0e0e14',
                    },
                    body: {
                      padding: '16px',
                      background: '#0e0e14',
                      flex: 1,
                    },
                  }}
                >
                  {card.isLink && card.content ? (
                    <AntdLink href={card.content} target="_blank">
                      {card.content}
                    </AntdLink>
                  ) : (
                    card.content
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Modal>
    </>
  );
};
