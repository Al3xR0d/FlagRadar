import Modal from 'antd/es/modal/Modal';
import { AntdClose } from '@/shared/ui/Close';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import { AntdLink } from '@/shared/ui/Link';

interface CTFModalProps {
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
}

export const CTFModal: React.FC<CTFModalProps> = ({
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
}) => {
  const cardData = [
    { title: 'НАЗВАНИЕ', content: name },
    { title: 'ОПИСАНИЕ', content: description },
    { title: 'ДАТА НАЧАЛА', content: date },
    { title: 'ДАТА ОКОНЧАНИЯ', content: dateEnd },
    { title: 'МЕСТО ПРОВЕДЕНИЯ', content: place },
    { title: 'ФОРМАТ', content: format },
    { title: 'ФОРМАТ МЕРОПРИЯТИЯ', content: eventFormat },
    { title: 'ПРАВИЛА', content: rules, isLink: true },
    { title: 'НАЧАЛО РЕГИСТРАЦИИ', content: regStart },
    { title: 'ОКОНЧАНИЕ РЕГИСТРАЦИИ', content: regEnd },
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
