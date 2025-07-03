import React, { useState } from 'react';
import styled from 'styled-components';
import { useCurrentUser, useFetchRules } from '@/hooks/useQueries';
import { Header } from '@/components/Layout/Header';
import Descriptions from 'antd/es/descriptions';
import { CopyOutlined } from '@ant-design/icons';
import { AntdButton } from '@/shared/ui/Button';
import Flex from 'antd/es/flex';
import message from 'antd/es/message';
import { EditUserModal } from '@/components/Modal/EditUserModal';
import { Footer } from '@/components/Layout/Footer';
import { CustomSpin } from '@/shared/ui/Spin';
import { PageContainer } from '@/shared/ui/PageContainer';
import { StyledCard } from '@/shared/ui/StyledCard';

const StyledDescriptions = styled(Descriptions)`
  background: #1a1a24;
`;

const UserPage: React.FC = () => {
  const { data, isLoading } = useCurrentUser();
  const [messageApi, contextHolder] = message.useMessage();
  const [isCreateVisible, setCreateVisible] = useState(false);
  const currentRules = useFetchRules();

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Скопировано',
    });
  };

  if (isLoading) {
    return <CustomSpin />;
  }

  return (
    <>
      <PageContainer vertical>
        {contextHolder}
        <Header title="Профиль" />
        <StyledCard>
          <Flex gap="middle" vertical>
            <StyledDescriptions bordered column={1}>
              <Descriptions.Item
                label="Никнейм"
                style={{ color: '#e0e0ff', border: '1px solid #25253a' }}
              >
                {data?.nickname}
              </Descriptions.Item>
              <Descriptions.Item
                label="Личный email"
                style={{ color: '#e0e0ff', border: '1px solid #25253a' }}
              >
                {data?.email}
              </Descriptions.Item>
              <Descriptions.Item
                label="О себе"
                style={{ color: '#e0e0ff', border: '1px solid #25253a' }}
              >
                {data?.description}
              </Descriptions.Item>
              <Descriptions.Item
                label="JWT для обращения в поддержку"
                style={{ color: '#e0e0ff', border: '1px solid #25253a' }}
              >
                <Flex gap="middle">
                  {data?.jwt}
                  <Flex align="center">
                    {data?.jwt ? (
                      <AntdButton
                        icon={<CopyOutlined />}
                        onClick={() => {
                          navigator.clipboard.writeText(`${data?.jwt}`);
                          success();
                        }}
                      />
                    ) : (
                      ''
                    )}
                  </Flex>
                </Flex>
              </Descriptions.Item>
            </StyledDescriptions>
            <AntdButton
              icon={<i className="fas fa-edit" />}
              text="Редактировать"
              onClick={() => setCreateVisible(true)}
            />
          </Flex>
        </StyledCard>
        {isCreateVisible && (
          <EditUserModal
            visible={isCreateVisible}
            onClose={() => setCreateVisible(false)}
            nickname={data?.nickname}
            email={data?.email}
            description={data?.description}
          />
        )}
        <Footer />
      </PageContainer>
    </>
  );
};

export default UserPage;
