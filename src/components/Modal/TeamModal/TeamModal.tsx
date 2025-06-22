import Modal from 'antd/es/modal';
import { AntdClose } from '@/shared/ui/Close';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Row from 'antd/es/row';

interface CTFModalProps {
  open: boolean;
  onClose: () => void;
  name?: string;
  token?: string;
  members?: string[];
}

export const TeamModal: React.FC<CTFModalProps> = ({ open, onClose, name, token, members }) => {
  const cardData = [
    { title: 'НАЗВАНИЕ', content: name },
    { title: 'ТОКЕН', content: token },
    { title: 'УЧАСТНИКИ', content: members },
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
                  {card.content}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Modal>
    </>
  );
};
