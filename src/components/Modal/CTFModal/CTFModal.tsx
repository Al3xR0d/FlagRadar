import Modal from 'antd/es/modal/Modal';
import { AntdClose } from '@/shared/ui/Close';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import { AntdLink } from '@/shared/ui/Link';
import { useEventById } from '@/hooks/useQueries';
import { useUserStore } from '@/store/userStore';
import { formatTime } from '@/helpers/helpers';

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

  const cardData = [
    { title: 'НАЗВАНИЕ', content: name },
    { title: 'ОПИСАНИЕ', content: description },
    ...(date ? [{ title: 'ДАТА НАЧАЛА', content: formatTime(date) }] : []),
    ...(dateEnd ? [{ title: 'ДАТА ОКОНЧАНИЯ', content: formatTime(dateEnd) }] : []),
    { title: 'МЕСТО ПРОВЕДЕНИЯ', content: place },
    { title: 'ФОРМАТ', content: format },
    { title: 'ФОРМАТ CTF', content: eventFormat },
    { title: 'ПРАВИЛА', content: rules, isLink: true },
    ...(regStart ? [{ title: 'НАЧАЛО РЕГИСТРАЦИИ', content: formatTime(regStart) }] : []),
    ...(regEnd ? [{ title: 'ОКОНЧАНИЕ РЕГИСТРАЦИИ', content: formatTime(regEnd) }] : []),
    ...(isAdmin && data?.tokens ? [{ title: 'ТОКЕНЫ', content: data?.tokens?.join('\n') }] : []),
  ];

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
        footer={[<></>]}
      >
        <div style={{ padding: '16px 0' }}>
          <Row gutter={[16, 16]}>
            {cardData.map((card, index) => (
              <Col key={index} xs={24} sm={12} md={8}>
                <Card
                  title={<span style={{ color: '#8a8aa8' }}>{card.title}</span>}
                  style={{
                    background: '#0e0e14',
                    border: '1px solid #25253a',
                    color: '#e0e0ff',
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
