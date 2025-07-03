import React from 'react';
import styled from 'styled-components';
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

const StyledModal = styled(Modal)`
  & .ant-modal-content {
    background: #151522;
  }

  & .ant-modal-header {
    background: #151522;
    color: #e0e0ff;
  }

  & .ant-modal-body {
    background: #151522;
    color: #e0e0ff;
  }

  & .ant-modal-mask {
    backdrop-filter: blur(5px);
  }
`;

const ModalTitle = styled.span`
  color: #e0e0ff;
`;

const StyledCard = styled(Card)`
  background: #0e0e14;
  border: 1px solid #25253a;
  color: #e0e0ff;

  & .ant-card-head {
    border-bottom: none;
    padding: 0 16px;
    background: #0e0e14;
  }

  & .ant-card-body {
    padding: 16px;
    background: #0e0e14;
  }
`;

const CardTitle = styled.span`
  color: #8a8aa8;
`;

const ContentWrapper = styled.div`
  padding: 16px 0;
`;

const MembersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const GridHeader = styled.div`
  font-weight: bold;
  padding: 8px;
  border-bottom: 1px solid #333;
`;

const GridCell = styled.div`
  padding: 8px;
  border-bottom: 1px solid #333;
`;

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

  const cardData = [
    { title: 'НАЗВАНИЕ', content: name },
    { title: 'ТОКЕН', content: token },
    {
      title: 'УЧАСТНИКИ',
      content: loading ? (
        <CustomSpin />
      ) : (
        <MembersGrid>
          <GridHeader>Логин</GridHeader>
          <GridHeader>Sber PDI</GridHeader>
          {memberData.map((user) => {
            const u = user as Me;
            return (
              <React.Fragment key={u.uuid}>
                <GridCell>{u.nickname}</GridCell>
                <GridCell>{u.sber_pdi}</GridCell>
              </React.Fragment>
            );
          })}
        </MembersGrid>
      ),
    },
  ];

  return (
    <StyledModal
      centered
      open={open}
      onCancel={onClose}
      title={<ModalTitle>{name}</ModalTitle>}
      closeIcon={<AntdClose />}
      destroyOnHidden
      maskClosable={false}
      width={1100}
      footer={null}
    >
      <ContentWrapper>
        <Row gutter={[16, 16]}>
          {cardData.map((card, index) => (
            <Col key={index} xs={24} sm={12} md={8}>
              <StyledCard title={<CardTitle>{card.title}</CardTitle>}>{card.content}</StyledCard>
            </Col>
          ))}
        </Row>
      </ContentWrapper>
    </StyledModal>
  );
};
