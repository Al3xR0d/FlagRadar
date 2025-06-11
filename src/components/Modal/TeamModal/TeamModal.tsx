import React from 'react';
import Modal from 'antd/es/modal';
import { AntdClose } from '@/shared/ui/Close';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import { fetchUserById } from '@/services/Api';
import { useQueries } from 'react-query';
import { Me } from '@/types';
import { UseQueryResult } from 'react-query';
import { CustomSpin } from '@/shared/ui/Spin';

interface Props {
  open: boolean;
  onClose: () => void;
  name?: string;
  token?: string;
  members?: string[];
}

export const TeamModal: React.FC<Props> = ({ open, onClose, name, token, members }) => {
  const userQueries = useQueries(
    (members || []).map((id) => ({
      queryKey: ['user', id],
      queryFn: () => fetchUserById(id),
      enabled: !!id && open,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    })),
  ) as UseQueryResult<Me>[];

  const loading = userQueries.some((q) => q.isLoading);
  const memberData = userQueries.map((q) => q.data).filter(Boolean);

  const columns = [
    {
      title: 'Логин',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: 'Sber PDI',
      dataIndex: 'sber_pdi',
      key: 'sber_pdi',
    },
  ];

  const cardData = [
    { title: 'НАЗВАНИЕ', content: name },
    { title: 'ТОКЕН', content: token },
    {
      title: 'УЧАСТНИКИ',
      content: loading ? (
        <CustomSpin />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          <div style={{ fontWeight: 'bold', padding: '8px', borderBottom: '1px solid #333' }}>
            Логин
          </div>
          <div style={{ fontWeight: 'bold', padding: '8px', borderBottom: '1px solid #333' }}>
            Sber PDI
          </div>

          {memberData.map((user) => {
            const u = user as Me;
            return (
              <React.Fragment key={u.uuid}>
                <div style={{ padding: '8px', borderBottom: '1px solid #333' }}>{u.nickname}</div>
                <div style={{ padding: '8px', borderBottom: '1px solid #333' }}>{u.sber_pdi}</div>
              </React.Fragment>
            );
          })}
        </div>
      ),
    },
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
